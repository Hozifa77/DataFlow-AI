"use client";

import { useEffect, useState } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileQuestion,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DocumentsArchive() {
  const [docs, setDocs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchDocs() {
     setIsLoading(true);
     const { data, error } = await supabase
       .from('documents')
       .select('*')
       .order('created_at', { ascending: false });

     if (data) setDocs(data);
     setIsLoading(false);
  }

  useEffect(() => {
    fetchDocs();
  }, []);

  const filteredDocs = docs.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch(status) {
       case 'validated': return 'bg-green-50 text-green-700 border-green-100';
       case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
       case 'review': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
       default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
     switch(status) {
       case 'validated': return <CheckCircle2 className="w-3 h-3 mr-1.5" />;
       case 'processing': return <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />;
       case 'review': return <AlertTriangle className="w-3 h-3 mr-1.5" />;
       default: return <Clock className="w-3 h-3 mr-1.5" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Data Warehouse</div>
           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Full Document Archive</h1>
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by filename..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#2E7D32]/5 focus:border-[#2E7D32] outline-none transition-all font-medium text-sm shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 shadow-sm transition-all hover:shadow-md">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden min-h-[500px] flex flex-col transition-all hover:shadow-2xl">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
             <Loader2 className="w-12 h-12 animate-spin text-[#2E7D32]" />
             <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">Querying Vault...</p>
          </div>
        ) : filteredDocs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-50">
                  <th className="p-6">Document Identity</th>
                  <th className="p-6">Status Pipeline</th>
                  <th className="p-6">AI Confidence</th>
                  <th className="p-6">Processing Date</th>
                  <th className="p-6 text-right">Interactions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                         <div className={`p-3 rounded-xl shadow-sm ${doc.name.endsWith('.pdf') ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                            <FileText className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="font-extrabold text-gray-900 text-sm group-hover:text-[#2E7D32] transition-colors">{doc.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase mt-0.5">{doc.id}</div>
                         </div>
                      </div>
                    </td>
                    <td className="p-6">
                       <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-tight border shadow-sm ${getStatusStyle(doc.status)}`}>
                         {getStatusIcon(doc.status)}
                         {doc.status}
                       </span>
                    </td>
                    <td className="p-6">
                       <div className="flex flex-col space-y-1.5 max-w-[100px]">
                          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                             <span>ACCURACY</span>
                             <span className="text-gray-900">{(doc.confidence_avg * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                   doc.confidence_avg >= 0.95 ? 'bg-green-500' : 
                                   doc.confidence_avg >= 0.80 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${doc.confidence_avg * 100}%` }}
                             ></div>
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <div className="text-sm font-bold text-gray-900">{new Date(doc.created_at).toLocaleDateString()}</div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{new Date(doc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end space-x-2">
                          <Link 
                            href={`/dashboard/validation/${doc.id}`}
                            className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#2E7D32] hover:bg-[#E8F5E9] transition-all shadow-sm hover:shadow-md"
                          >
                             <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm hover:shadow-md">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-6 text-center">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                <FileQuestion className="w-12 h-12" />
             </div>
             <div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No documents indexed</h3>
                <p className="text-gray-500 max-w-sm font-medium leading-relaxed">Your secure document repository is currently empty. Start by uploading files for AI processing.</p>
             </div>
             <Link 
                href="/dashboard/upload" 
                className="bg-[#111827] hover:bg-black text-white px-10 py-4 rounded-xl font-bold shadow-xl transition-all active:scale-95"
              >
                Upload First Document
              </Link>
          </div>
        )}
        
        {filteredDocs.length > 0 && (
          <div className="p-6 border-t border-gray-50 bg-gray-50/10 flex items-center justify-between">
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Showing {filteredDocs.length} of {docs.length} Entries
             </div>
             <div className="flex items-center space-x-2">
                <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-white disabled:opacity-30" disabled>
                   <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-white disabled:opacity-30" disabled>
                   <ChevronRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
