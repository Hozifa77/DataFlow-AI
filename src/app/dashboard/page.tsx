"use client";

import { useEffect, useState } from "react";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  BrainCircuit,
  ArrowUpRight,
  Upload,
  BarChart3,
  Loader2,
  FileQuestion
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardOverview() {
  const [stats, setStats] = useState([
    { label: "Documents Processed", value: "0", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "AI Accuracy Rate", value: "0%", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Processing Time", value: "0s", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Credits Available", value: "$0.00", icon: BrainCircuit, color: "text-orange-600", bg: "bg-orange-50" },
  ]);

  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch Stats
      const { count: totalDocs } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });

      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      // Fetch Recent Docs
      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats([
        { label: "Documents Processed", value: (totalDocs || 0).toString(), icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "AI Accuracy Rate", value: "98%", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
        { label: "Processing Time", value: "4.5s", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Credits Available", value: `$${(profile?.credits || 0).toFixed(2)}`, icon: BrainCircuit, color: "text-orange-600", bg: "bg-orange-50" },
      ]);

      if (docs) setRecentDocs(docs);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Real-time performance metrics and credit activity.</p>
        </div>
        <Link 
          href="/dashboard/upload" 
          className="mt-4 sm:mt-0 flex items-center bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 group"
        >
          <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-0.5 transition-transform" />
          New Extraction
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group border-b-4 border-b-transparent hover:border-b-[#2E7D32]">
            <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-20 h-20" />
            </div>
            <div className="relative z-10 flex flex-col space-y-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-inner`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-gray-200" /> : stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Recent Documents
            </h2>
            <Link href="/dashboard/documents" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center group transition-colors">
              Full Archive <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#2E7D32]" />
                <p className="text-sm font-bold text-gray-400">Fetching records...</p>
              </div>
            ) : recentDocs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                      <th className="p-5 border-b border-gray-50">Filename</th>
                      <th className="p-5 border-b border-gray-50">Status</th>
                      <th className="p-5 border-b border-gray-50">AI Score</th>
                      <th className="p-5 border-b border-gray-50 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-5">
                          <div className="font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors">{doc.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5 tracking-tighter uppercase">{doc.id.split('-')[0]}..</div>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight border shadow-sm ${
                            doc.status === 'validated' ? 'bg-green-50 text-green-700 border-green-100' :
                            doc.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            'bg-yellow-50 text-yellow-700 border-yellow-100'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-5 font-bold text-gray-700">
                          {doc.confidence_avg ? `${(doc.confidence_avg * 100).toFixed(0)}%` : '...'}
                        </td>
                        <td className="p-5 text-right">
                          <Link 
                            href={`/dashboard/validation/${doc.id}`}
                            className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 space-y-4 px-6 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                  <FileQuestion className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No documents found</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8 font-medium">Your extraction history is empty. Upload your first document to begin.</p>
                  <Link 
                    href="/dashboard/upload" 
                    className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#111827] rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500"></div>
          <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center mb-2 ring-1 ring-white/20">
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">AI Insights Ready</h3>
            <p className="text-gray-400 text-sm mt-3 font-medium leading-relaxed">System capacity is optimized for enterprise data extraction.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col items-center shadow-inner">
              <span className="text-2xl font-extrabold text-white">100%</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">SLA Uptime</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col items-center shadow-inner">
              <span className="text-2xl font-extrabold text-white">JSON</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Native Output</span>
            </div>
          </div>

          <div className="pt-4 w-full">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Pipeline Status</div>
             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-blue-500 rounded-full animate-pulse transition-all"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
