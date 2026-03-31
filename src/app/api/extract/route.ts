import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Free Hugging Face models for different file types
const HF_MODELS = {
  // Text extraction from documents - free, no auth required for some
  textExtraction: "mistralai/Mistral-7B-Instruct-v0.2",
  // Image/document OCR - extracts text from images
  imageOcr: "microsoft/trocr-large-handwritten",
  // Alternative OCR that works well with invoices/receipts
  documentOcr: "google/pix2struct-docvqa-large",
  // Simple image captioning for understanding document content
  imageCaptioning: "Salesforce/blip-image-captioning-large",
};

async function extractWithHF(apiKey: string, text: string): Promise<any> {
  const model = HF_MODELS.textExtraction;
  const prompt = `<s>[INST] You are a data extraction assistant. Extract structured JSON data from this document text.
Return ONLY valid JSON with these exact fields: vendorName (string), invoiceDate (string in YYYY-MM-DD format), totalAmount (string with $ sign), and lineItems (array of objects with desc, qty, price, total).

Document Text:
${text}

Return ONLY the JSON object, no other text. [/INST]</s>`;

  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        return_full_text: false,
        temperature: 0.1,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HF API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  const generatedText = data[0]?.generated_text || "";

  // Extract JSON from the response
  const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }
  return null;
}

async function extractImageWithHF(apiKey: string, base64Image: string): Promise<any> {
  // Use BLIP for image captioning to understand what's in the image
  const model = HF_MODELS.imageCaptioning;
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: imageBuffer,
  });

  if (!res.ok) {
    throw new Error(`HF Image API error: ${res.status}`);
  }

  const data = await res.json();
  const caption = Array.isArray(data) ? data[0]?.generated_text || "" : "";

  // Now use text model to extract structured data from the caption
  if (caption) {
    return await extractWithHF(apiKey, `Image content described as: ${caption}`);
  }
  return null;
}

async function extractDocumentWithHF(apiKey: string, base64Image: string): Promise<string> {
  // Use TrOCR for document OCR - extracts text from document images
  const model = HF_MODELS.imageOcr;
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: imageBuffer,
  });

  if (!res.ok) {
    throw new Error(`HF OCR API error: ${res.status}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data[0]?.generated_text || "" : "";
}

export async function POST(req: Request) {
  try {
    const { fileName, fileType, userId, textContent, fileData } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hfKey = process.env.HUGGING_FACE_API_KEY;

    if (!hfKey) {
      return NextResponse.json({
        error: 'HUGGING_FACE_API_KEY is not configured. Add it to your .env.local file.'
      }, { status: 500 });
    }

    // 2. Check Credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (profileError || !profile || profile.credits < 0.05) {
      return NextResponse.json({ error: 'Insufficient credits. Each extraction costs $0.05.' }, { status: 402 });
    }

    // 3. AI Extraction Logic
    let extractedData = {
      vendorName: "",
      invoiceDate: new Date().toISOString().split('T')[0],
      totalAmount: "",
      lineItems: [] as any[],
    };

    let confidence = 0.75;

    try {
      const isImage = fileType?.startsWith('image/');
      const isPdf = fileType === 'application/pdf';

      if (fileData && (isImage || isPdf)) {
        // For images: OCR the image, then extract structured data
        const ocrText = await extractDocumentWithHF(hfKey, fileData);

        if (ocrText) {
          const structured = await extractWithHF(hfKey, ocrText);
          if (structured) {
            extractedData = { ...extractedData, ...structured };
            confidence = 0.88;
          } else {
            // Fallback: use image captioning
            const captionData = await extractImageWithHF(hfKey, fileData);
            if (captionData) {
              extractedData = { ...extractedData, ...captionData };
              confidence = 0.78;
            }
          }
        }
      } else if (textContent) {
        // Text-based extraction (for text files, or pre-extracted text from PDFs)
        const structured = await extractWithHF(hfKey, textContent);
        if (structured) {
          extractedData = { ...extractedData, ...structured };
          confidence = 0.92;
        }
      }

      // If extraction returned empty data, use filename-based fallback
      if (!extractedData.vendorName && !extractedData.totalAmount) {
        extractedData = {
          vendorName: `Extracted from ${fileName}`,
          invoiceDate: new Date().toISOString().split('T')[0],
          totalAmount: "$0.00",
          lineItems: [{ desc: "Extraction in progress - please review", qty: 1, price: "$0.00", total: "$0.00" }],
        };
        confidence = 0.50;
      }
    } catch (e: any) {
      console.warn("HF Extraction failed, using fallback", e.message);
      extractedData = {
        vendorName: fileName?.replace(/\.[^/.]+$/, "") || "Unknown",
        invoiceDate: new Date().toISOString().split('T')[0],
        totalAmount: "Review Required",
        lineItems: [{ desc: "AI extraction encountered an error - manual review needed", qty: 1, price: "N/A", total: "N/A" }],
      };
      confidence = 0.40;
    }

    // 4. Deduct Credits
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - 0.05 })
      .eq('id', userId);

    // 5. Log transaction
    await supabase.from('transactions').insert([{
      user_id: userId,
      type: 'deduction',
      amount: 0.05,
      description: `Document extraction - ${fileName}`,
    }]);

    // 6. Create notification
    await supabase.from('notifications').insert([{
      user_id: userId,
      type: 'success',
      title: 'Processing Complete',
      message: `Your document "${fileName}" has been processed successfully.`,
      read: false,
    }]);

    // 7. Low balance check
    const newBalance = profile.credits - 0.05;
    if (newBalance <= 2 && newBalance > 0) {
      await supabase.from('notifications').insert([{
        user_id: userId,
        type: 'warning',
        title: 'Low Balance',
        message: 'Your balance is running low. Please recharge.',
        read: false,
      }]);
    }
    if (newBalance <= 0) {
      await supabase.from('notifications').insert([{
        user_id: userId,
        type: 'error',
        title: 'No Credits',
        message: 'You have no credits remaining.',
        read: false,
      }]);
    }

    // 8. Store in Supabase
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert([{
        user_id: userId,
        name: fileName,
        status: 'review',
        confidence_avg: confidence,
        extracted_data: extractedData,
      }])
      .select()
      .single();

    if (docError) throw docError;

    return NextResponse.json({ success: true, docId: doc.id, confidence });
  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
