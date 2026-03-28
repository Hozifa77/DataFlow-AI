import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  BrainCircuit,
  ArrowUpRight,
  Upload,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const stats = [
    { label: "Documents Processed", value: "1,294", icon: FileText, trend: "+12.5%", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "AI Accuracy Rate", value: "98.2%", icon: CheckCircle2, trend: "+0.4%", color: "text-green-600", bg: "bg-green-50" },
    { label: "Processing Time", value: "4.2s", icon: Clock, trend: "-1.1s", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Credits Available", value: "$42.50", icon: BrainCircuit, trend: null, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const recentDocs = [
    { id: "DOC-2024-001", name: "Q3_Invoice_Acme.pdf", status: "Validated", time: "10 mins ago", confidence: "99%" },
    { id: "DOC-2024-002", name: "Employee_Records.xlsx", status: "Processing", time: "1 hr ago", confidence: "..." },
    { id: "DOC-2024-003", name: "Tax_Form_W2.jpg", status: "Review Needed", time: "3 hrs ago", confidence: "85%" },
    { id: "DOC-2024-004", name: "Vendor_Receipts.zip", status: "Validated", time: "1 day ago", confidence: "96%" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Monitor your data extraction performance and credit usage.</p>
        </div>
        <Link 
          href="/dashboard/upload" 
          className="mt-4 sm:mt-0 flex items-center bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Upload className="w-5 h-5 mr-2" />
          New Extraction
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-16 h-16" />
            </div>
            <div className="relative z-10 flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                {stat.trend && (
                  <div className={`text-xs font-semibold mt-1 flex items-center ${stat.trend.startsWith("+") ? "text-green-600" : "text-emerald-600"}`}>
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    {stat.trend} from last month
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Recent Documents</h2>
            <Link href="/dashboard/documents" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-gray-200">Document</th>
                  <th className="p-4 font-semibold border-b border-gray-200">Status</th>
                  <th className="p-4 font-semibold border-b border-gray-200">AI Confidence</th>
                  <th className="p-4 font-semibold border-b border-gray-200">Time</th>
                  <th className="p-4 font-semibold border-b border-gray-200 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{doc.name}</div>
                      <div className="text-xs text-gray-500">{doc.id}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        doc.status === 'Validated' ? 'bg-green-50 text-green-700 border-green-200' :
                        doc.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{doc.confidence}</td>
                    <td className="p-4 text-sm text-gray-500">{doc.time}</td>
                    <td className="p-4 text-right">
                      {doc.status === "Review Needed" ? (
                        <Link 
                          href={`/dashboard/validation/${doc.id}`}
                          className="inline-flex items-center text-xs font-semibold bg-[#1976D2] hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
                        >
                          Review Now
                        </Link>
                      ) : (
                        <button className="text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-2">View</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-[#F3E5F5] text-[#8E24AA] rounded-full flex items-center justify-center mb-2">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Analytics Pipeline Ready</h3>
          <p className="text-gray-500 text-sm mb-4">Export capabilities directly to your custom data models are active.</p>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">4</span>
              <span className="text-xs text-gray-500 font-medium mt-1">Formats Configured</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">1</span>
              <span className="text-xs text-gray-500 font-medium mt-1">Active Webhook</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
