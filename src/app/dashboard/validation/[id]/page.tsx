"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Database, Download, AlertTriangle, FileSpreadsheet, Code, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ValidationScreen() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [docName, setDocName] = useState("");

  const [headerData, setHeaderData] = useState<any[]>([]);
  const [lineItems, setLineItems] = useState<any[]>([]);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function fetchDoc() {
      if (!id) return;
      setLoading(true);
      
      const { data: doc, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !doc) {
        console.error("Error fetching document:", error);
        router.push('/dashboard');
        return;
      }

      setDocName(doc.name);
      
      // Parse extracted_data
      const ext = doc.extracted_data || {};
      
      // Map to UI friendly header data
      const mappedHeader = [
        { key: "vendorName", label: "Vendor Name", value: ext.vendorName || "", confidence: 99 },
        { key: "invoiceDate", label: "Invoice Date", value: ext.invoiceDate || "", confidence: 95 },
        { key: "totalAmount", label: "Total Amount", value: ext.totalAmount || "", confidence: 100 },
      ];
      
      setHeaderData(mappedHeader);
      setLineItems(ext.lineItems || []);
      setLoading(false);
    }

    fetchDoc();
  }, [id]);

  const getConfidenceColor = (conf: number) => {
    if (conf >= 95) return "text-green-600 bg-green-50 border-green-200";
    if (conf >= 80) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const updateHeaderField = (index: number, newValue: string) => {
    const newData = [...headerData];
    newData[index].value = newValue;
    newData[index].confidence = 100; // Human validated
    setHeaderData(newData);
  };

  const updateLineItem = (index: number, field: string, newValue: string) => {
    const newItems = [...lineItems];
    (newItems[index] as any)[field] = newValue;
    setLineItems(newItems);
  };

  const handleExport = async () => {
    setExporting(true);
    
    // Save state to Supabase first
    const updatedData = {
      vendorName: headerData.find(h => h.key === 'vendorName')?.value,
      invoiceDate: headerData.find(h => h.key === 'invoiceDate')?.value,
      totalAmount: headerData.find(h => h.key === 'totalAmount')?.value,
      lineItems: lineItems
    };

    const { error } = await supabase
      .from('documents')
      .update({ 
        extracted_data: updatedData,
        status: 'validated'
      })
      .eq('id', id);

    if (error) {
      console.error("Save error:", error);
      setExporting(false);
      return;
    }

    setTimeout(() => {
      setExporting(false);
      setShowExportModal(false);
      router.push("/dashboard");
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#2E7D32]" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Initializing Validation Engine...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Human-in-the-Loop Validation</div>
             <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
              {docName}
              <span className="ml-4 px-3 py-1 text-[10px] font-extrabold bg-[#E3F2FD] text-[#1976D2] rounded-full uppercase tracking-tight border border-blue-100 shadow-sm">Reviewing</span>
            </h1>
          </div>
        </div>
        <button 
          onClick={() => setShowExportModal(true)}
          className="flex items-center bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl active:scale-95 group"
        >
          <CheckCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          Verify & Finalize
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        {/* Left pane: Document Viewer */}
        <div className="bg-gray-50 rounded-3xl border border-gray-100 shadow-inner overflow-hidden flex flex-col relative">
          <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md border border-white/40 px-4 py-2 rounded-xl shadow-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest z-10">
            Source Preview
          </div>
          <div className="flex-1 flex items-center justify-center relative p-12">
            <div className="w-full max-w-sm aspect-[1/1.4] bg-white shadow-2xl rounded-lg p-10 flex flex-col space-y-6 ring-1 ring-gray-100 relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/20 pointer-events-none rounded-lg"></div>
              <div className="h-10 bg-gray-50 rounded-lg w-1/2"></div>
              <div className="h-5 bg-gray-50/50 rounded-md w-1/4 mb-4"></div>
              
              <div className="space-y-4 mt-8">
                <div className="h-4 bg-gray-50 rounded w-full"></div>
                <div className="h-4 bg-gray-50 rounded w-5/6"></div>
                <div className="h-4 bg-red-50/50 border border-red-100 rounded w-4/6 relative group cursor-pointer transition-colors hover:bg-red-50">
                  <div className="absolute -right-1.5 -top-1.5 w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-200 flex items-center justify-center animate-bounce">
                     <AlertTriangle className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>

              <div className="mt-auto border-t border-gray-50 pt-8 space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-50 w-1/3 rounded"></div>
                  <div className="h-4 bg-gray-50 w-1/4 rounded"></div>
                </div>
                <div className="flex justify-between items-center py-2 relative">
                  <div className="h-4 bg-yellow-50/50 border border-yellow-100 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-900 w-1/4 rounded shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right pane: Extracted Data fields */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col transition-all hover:shadow-2xl">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h2 className="font-bold text-gray-900 flex items-center text-lg">
              <Database className="w-5 h-5 mr-3 text-indigo-500" />
              AI Extraction Results
            </h2>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Fields: {headerData.length + lineItems.length}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-12">
            <div className="space-y-6">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Master Attributes</div>
              {headerData.map((field, idx) => (
                <div key={idx} className="group transition-all">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-2 flex items-center justify-between">
                    {field.label}
                    <span className={`px-2 py-0.5 rounded-md border text-[8px] font-extrabold ${getConfidenceColor(field.confidence)}`}>
                      {field.confidence}% {field.confidence < 95 ? 'UNCERTAIN' : 'MATCH'}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateHeaderField(idx, e.target.value)}
                      className={`block w-full px-5 py-4 rounded-xl border-2 focus:ring-4 focus:outline-none transition-all text-gray-900 font-bold text-sm ${
                        field.confidence < 95 ? "border-yellow-100 bg-yellow-50/30 focus:border-yellow-400 focus:ring-yellow-50" : "border-gray-50 bg-gray-50/30 focus:border-[#2E7D32] focus:ring-[#2E7D32]/5 hover:bg-gray-50"
                      }`}
                    />
                    {field.confidence < 95 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                         <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
               <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Tabular Data</div>
              <div className="border border-gray-50 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left bg-white text-xs">
                  <thead className="bg-gray-50/50 border-b border-gray-50 text-gray-400">
                    <tr>
                      <th className="px-6 py-4 font-bold uppercase tracking-widest">Description</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-widest">Qty</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-widest">Price</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-widest">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {lineItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                        <td className="p-3">
                          <input 
                            value={item.desc}
                            onChange={(e) => updateLineItem(idx, 'desc', e.target.value)}
                            className="w-full px-3 py-3 border-none bg-transparent hover:bg-white rounded-lg focus:ring-2 focus:ring-[#2E7D32]/20 outline-none font-bold text-gray-900"
                          />
                        </td>
                        <td className="p-3 w-16">
                          <input 
                            value={item.qty}
                            onChange={(e) => updateLineItem(idx, 'qty', e.target.value)}
                            className="w-full px-3 py-3 border-none bg-transparent hover:bg-white rounded-lg text-center focus:ring-2 focus:ring-[#2E7D32]/20 outline-none font-bold"
                          />
                        </td>
                        <td className="p-3 w-24">
                          <input 
                            value={item.price}
                            onChange={(e) => updateLineItem(idx, 'price', e.target.value)}
                            className="w-full px-3 py-3 border-none bg-transparent hover:bg-white rounded-lg text-right focus:ring-2 focus:ring-[#2E7D32]/20 outline-none font-bold"
                          />
                        </td>
                        <td className="p-3 w-32">
                          <input 
                            value={item.total}
                            onChange={(e) => updateLineItem(idx, 'total', e.target.value)}
                            className="w-full px-3 py-3 border-none bg-transparent hover:bg-white rounded-lg text-right focus:ring-2 focus:ring-[#2E7D32]/20 outline-none font-extrabold text-[#2E7D32]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Output Recommendation Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-[#0B0F19]/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="w-16 h-1 bg-[#2E7D32] rounded-full mx-auto mb-8"></div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center tracking-tight">Export Your Data</h2>
            <p className="text-gray-500 mb-10 font-medium text-center">Seamless delivery to your enterprise software stack.</p>

            <div className="space-y-4 mb-10">
              <label className="flex items-center p-5 bg-[#E8F5E9] border-2 border-[#2E7D32] rounded-2xl cursor-pointer shadow-sm transition-all active:scale-95">
                <input type="radio" name="export" className="text-[#2E7D32] focus:ring-[#2E7D32] h-5 w-5" defaultChecked />
                <div className="ml-5 flex items-center">
                  <div className="bg-white p-3 rounded-xl shadow-inner mr-4 text-[#2E7D32]">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Microsoft Excel</div>
                    <div className="text-[10px] text-[#2E7D32] font-extrabold mt-1 tracking-widest uppercase">Strongly Recommended</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center p-5 bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-2xl cursor-pointer group transition-all active:scale-95">
                <input type="radio" name="export" className="text-[#2E7D32] focus:ring-[#2E7D32] h-5 w-5" />
                <div className="ml-5 flex items-center">
                  <div className="bg-white p-3 rounded-xl shadow-inner mr-4 text-gray-400 group-hover:text-gray-900 transition-colors">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">JSON API Integration</div>
                    <div className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest uppercase truncate">Standard Format</div>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-8 py-4 bg-gray-50 rounded-xl text-gray-400 font-bold hover:bg-gray-100 hover:text-gray-900 transition-all text-sm uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={handleExport}
                className="flex-[2] bg-[#111827] hover:bg-black text-white px-8 py-4 rounded-xl font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center text-sm uppercase tracking-widest"
              >
                {exporting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-3" /> Execute Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
