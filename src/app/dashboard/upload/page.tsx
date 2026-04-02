"use client";

import { useState } from "react";
import { UploadCloud, File, Image as ImageIcon, CheckCircle, XCircle, AlertCircle, Loader2, BrainCircuit, Zap, Infinity, ArrowUpRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Link from "next/link";

const COST_PER_PAGE = 0.05;

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const { credits, user, showToast, refreshCredits, recordOperation } = useApp();

  const estimatePages = (file: File): number => {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB <= 1) return 1;
    return Math.ceil(sizeMB);
  };

  const totalPages = files.reduce((sum, f) => sum + estimatePages(f), 0);
  const totalCost = totalPages * COST_PER_PAGE;
  const isNoBalance = credits <= 0;
  const isLowBalance = credits > 0 && credits < totalCost;
  const canProcess = files.length > 0 && credits >= totalCost;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setErrorMsg(null);
    if (e.dataTransfer.files?.length) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    if (!canProcess) return;
    setErrorMsg(null);
    setUploading(true);

    try {
      const userId = user?.id;

      if (!userId) {
        setErrorMsg('Please sign in to process documents.');
        setUploading(false);
        return;
      }

      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: files[0].name,
          fileType: files[0].type,
          userId,
          pageCount: totalPages,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process document');
      }

      await refreshCredits();
      recordOperation();
      showToast("🎉 Your document was processed successfully!", "celebration");

      setTimeout(() => {
        showToast(`Keep going — you still have $${(credits - totalCost).toFixed(2)} remaining`, "info");
      }, 2000);

      router.push(`/dashboard/validation/${result.docId}`);
    } catch (err: any) {
      setErrorMsg(err.message);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-500">
      <div className="text-left border-l-4 border-[#2E7D32] pl-6 py-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Upload & Extract</h1>
        <p className="text-gray-500 mt-2 font-medium">Powering your workflow with precision-AI document understanding.</p>
      </div>

      {/* Zero Balance Overlay */}
      {isNoBalance && (
        <div className="bg-white rounded-2xl border-2 border-red-100 shadow-xl p-12 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">You&apos;ve used all your free credits.</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            To continue processing documents, add more credits or upgrade to the Unlimited Plan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/credits"
              className="w-full sm:w-auto flex items-center justify-center bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <Zap className="w-5 h-5 mr-2" />
              Add Credits
            </Link>
            <Link
              href="/dashboard/credits"
              className="w-full sm:w-auto flex items-center justify-center bg-[#1976D2] hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <Infinity className="w-5 h-5 mr-2" />
              Go Unlimited
            </Link>
          </div>
        </div>
      )}

      {/* Low Balance Warning */}
      {isLowBalance && !isNoBalance && (
        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm font-bold text-yellow-700">
              Insufficient Credits. Please recharge to continue.
            </p>
          </div>
          <Link
            href="/dashboard/credits"
            className="flex items-center space-x-1.5 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Recharge Now</span>
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center space-x-3 text-red-700 shadow-sm animate-pulse">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-bold tracking-tight">{errorMsg}</p>
        </div>
      )}

      {/* Main Action Button - ALWAYS VISIBLE, STICKY on mobile */}
      {files.length === 0 && !isNoBalance && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sticky top-0 z-20 -mt-4 mb-4">
          <button 
            onClick={() => document.getElementById('file-input')?.click()}
            className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-8 py-5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center group"
          >
            <BrainCircuit className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
            Start Data Entry
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Upload a file to begin extraction</p>
          <input 
            id="file-input"
            type="file" 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files?.length) {
                setFiles(Array.from(e.target.files));
              }
            }}
          />
        </div>
      )}

      {/* Upload Area - Compact */}
      <div 
        onDragOver={isNoBalance ? undefined : (e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={isNoBalance ? undefined : () => setIsDragOver(false)}
        onDrop={isNoBalance ? undefined : handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isNoBalance 
            ? "border-gray-100 bg-gray-50/50 opacity-50 cursor-not-allowed" 
            : isDragOver 
              ? "border-[#2E7D32] bg-[#E8F5E9] shadow-xl" 
              : "border-gray-200 bg-white hover:border-[#2E7D32]/50"
        }`}
      >
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all ${
          isNoBalance ? 'bg-gray-100' :
          isDragOver ? 'bg-white shadow-lg' : 'bg-gray-50'
        }`}>
          {isNoBalance ? (
            <Lock className="w-8 h-8 text-gray-300" />
          ) : (
            <UploadCloud className={`w-8 h-8 ${isDragOver ? "text-[#2E7D32]" : "text-gray-300"}`} />
          )}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {isNoBalance ? "Upload disabled" : "Drop files here"}
        </h3>
        <p className="text-gray-400 text-sm">
          {isNoBalance ? "Recharge credits to continue." : "PDF, PNG, JPG supported"}
        </p>
        
        {!isNoBalance && (
          <label className="bg-[#111827] hover:bg-black text-white px-6 py-3 rounded-lg font-bold cursor-pointer transition-all shadow-md inline-flex items-center mt-4">
            Choose Files
            <input 
              type="file" 
              className="hidden" 
              multiple 
              onChange={(e) => {
                if (e.target.files?.length) {
                  setFiles(Array.from(e.target.files));
                }
              }}
            />
          </label>
        )}
      </div>

{files.length > 0 && !isNoBalance && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-between border-b border-gray-50 pb-5">
            <h4 className="font-extrabold text-gray-900">
              Selected Document
            </h4>
            <button 
                onClick={() => setFiles([])}
                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
              >
                Clear All
            </button>
          </div>
          
          <div className="space-y-4">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 border border-gray-100 group">
                <div className="flex items-center space-x-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    file.name.endsWith('.pdf') ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-50'
                  }`}>
                    {file.name.endsWith('.pdf') ? <File className="w-6 h-6" /> : <ImageIcon className="w-6 h-6 text-blue-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{file.name}</p>
                    <p className="text-[10px] text-gray-400 font-extrabold tracking-widest uppercase">
                      {(file.size / 1024).toFixed(1)} KB · ~{estimatePages(file)} page{estimatePages(file) > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                   <div className="text-[10px] font-bold px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-lg shadow-sm ring-1 ring-[#2E7D32]/10">
                      READY TO EXTRACT
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col">
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Estimated Cost</div>
               <div className="text-xl font-extrabold text-gray-900 flex items-center">
                  ${totalCost.toFixed(2)}
                  <span className="ml-2 text-[10px] font-bold text-gray-400 uppercase">({totalPages} page{totalPages > 1 ? 's' : ''} @ $0.05)</span>
               </div>
            </div>
            
            <button 
              onClick={handleProcess}
              disabled={uploading || !canProcess}
              className={`w-full sm:w-auto bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl flex flex-col items-center justify-center min-w-[220px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group`}
            >
              {uploading ? (
                <span className="flex items-center">
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  AI Processing...
                </span>
              ) : (
                <>
                  <span className="flex items-center">
                    <BrainCircuit className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                    Start Data Entry
                  </span>
                  <span className="text-[10px] font-medium text-white/70 mt-1 tracking-wide">Upload → Process → Review → Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
