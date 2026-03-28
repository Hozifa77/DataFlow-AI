import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This is a basic skeleton for the AI extraction endpoint.
// In a real production app, you would use OpenAI or a local LLM here.
export async function POST(req: Request) {
  try {
    const { fileName, fileType, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Check AI API Key (from Vercel Environment Variables)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('AI API Key is missing. Please add OPENAI_API_KEY to your Vercel Environment Variables.');
      return NextResponse.json({ 
        error: 'AI Engine configuration missing. Contact administrator.' 
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

    // 3. Deduct Credits
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - 0.05 })
      .eq('id', userId);

    // 4. Simulate AI extraction (In reality, you'd send file buffer to GPT-4o-mini or similar)
    // We'll create a pending document in Supabase
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert([{
        user_id: userId,
        name: fileName,
        status: 'review',
        confidence_avg: 0.85 + Math.random() * 0.15,
        extracted_data: {
          vendorName: "Acme Corp (AI Sample)",
          invoiceDate: new Date().toISOString().split('T')[0],
          totalAmount: "$150.00",
          lineItems: [
            { desc: "Consulting Services", qty: 1, price: "$100.00", total: "$100.00" },
            { desc: "Tax/Fees", qty: 1, price: "$50.00", total: "$50.00" }
          ]
        }
      }])
      .select()
      .single();

    if (docError) throw docError;

    return NextResponse.json({ success: true, docId: doc.id });
  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
