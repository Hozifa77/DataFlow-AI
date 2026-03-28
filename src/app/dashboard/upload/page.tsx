"use client";

import { useState } from "react";
import { UploadCloud, File, Image as ImageIcon, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleProcess = () => {
    setUploading(true);
    // Simulate API call and redirect
    setTimeout(() => {
      setUploading(false);
      router.push("/dashboard/validation/DOC-2024-NEW");
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Upload & Extract</h1>
        <p className="text-gray-500 mt-1">Upload documents to run through the AI extraction pipeline.</p>
      </div>

      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          isDragOver ? "border-[#2E7D32] bg-[#E8F5E9] scale-[1.02]" : "border-gray-300 bg-white hover:border-gray-400"
        }`}
      >
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-4 ring-white">
          <UploadCloud className={`w-10 h-10 ${isDragOver ? "text-[#2E7D32]" : "text-gray-400"}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Drag & Drop files here</h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Supported formats: PDF, JPG, PNG, XLSX. Max file size: 50MB.
        </p>
        
        <label className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors shadow-sm inline-flex items-center">
          Browse Files
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
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
            <span>Files to process ({files.length})</span>
            <span className="text-sm font-medium text-gray-500">{files.reduce((acc, f) => acc + f.size, 0) / 1000000} MB total</span>
          </h4>
          
          <ul className="space-y-3">
            {files.map((file, idx) => (
              <li key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-[#2E7D32] transition-colors group">
                <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                  <div className={`p-2 rounded flex-shrink-0 ${
                    file.name.endsWith('.pdf') ? 'bg-red-50 text-red-600' :
                    file.name.endsWith('.xlsx') ? 'bg-green-50 text-green-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {file.name.endsWith('.pdf') ? <File className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-gray-900 truncate max-w-xs">{file.name}</p>
                    <p className="text-sm text-gray-500 font-medium">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-200">
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-700 rounded-full flex items-center shrink-0">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Pending OCR
                  </span>
                  <button 
                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-auto sm:ml-0 p-1"
                    title="Remove File"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between bg-white sticky bottom-0">
            <div className="text-sm text-gray-600 flex items-center">
              Processing cost: <span className="font-bold text-gray-900 ml-1"> ${(0.05 * files.length).toFixed(2)}</span>
            </div>
            <button 
              onClick={handleProcess}
              disabled={uploading}
              className={`bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md flex items-center ${
                uploading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5 mr-3" />
                  Start AI Extraction
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
