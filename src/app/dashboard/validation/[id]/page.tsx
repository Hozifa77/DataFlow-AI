"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, Database, Download, AlertTriangle, FileSpreadsheet, Code, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ValidationScreen() {
  const { id } = useParams();
  const router = useRouter();

  // Mock extracted data
  const [data, setData] = useState([
    { key: "vendorName", label: "Vendor Name", value: "Acme Corp", confidence: 99 },
    { key: "invoiceDate", label: "Invoice Date", value: "2024-03-15", confidence: 95 },
    { key: "dueDate", label: "Due Date", value: "2024-04-14", confidence: 90 },
    { key: "totalAmount", label: "Total Amount", value: "$4,250.00", confidence: 100 },
    { key: "taxAmount", label: "Tax Amount", value: "$350.00", confidence: 82, warning: "Possible mismatch with line items" },
    { key: "poNumber", label: "PO Number", value: "PO-09912", confidence: 65, warning: "Low OCR confidence on digit '1'" },
  ]);

  const [lineItems, setLineItems] = useState([
    { id: 1, desc: "Server Maintenance Q1", qty: "1", price: "$2,000.00", total: "$2,000.00", conf: 98 },
    { id: 2, desc: "Cloud Storage Backup", qty: "12", price: "$150.00", total: "$1,800.00", conf: 99 },
    { id: 3, desc: "SLA Support", qty: "1", price: "$100.00", total: "$100.00", conf: 75, warning: "Typo detected" },
  ]);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const getConfidenceColor = (conf: number) => {
    if (conf >= 95) return "text-green-600 bg-green-50 border-green-200";
    if (conf >= 80) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const updateField = (index: number, newValue: string) => {
    const newData = [...data];
    newData[index].value = newValue;
    // Mark as human-validated
    newData[index].confidence = 100;
    newData[index].warning = undefined;
    setData(newData);
  };

  const updateLineItem = (index: number, field: string, newValue: string) => {
    const newItems = [...lineItems];
    (newItems[index] as any)[field] = newValue;
    newItems[index].conf = 100;
    newItems[index].warning = undefined;
    setLineItems(newItems);
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setShowExportModal(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center">
              Validation: {id}
              <span className="ml-3 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">Review Mode</span>
            </h1>
          </div>
        </div>
        <button 
          onClick={() => setShowExportModal(true)}
          className="flex items-center bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md group"
        >
          <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Approve & Export
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Left pane: Document Viewer */}
        <div className="bg-gray-200 rounded-xl border border-gray-300 shadow-inner overflow-hidden flex flex-col relative">
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded shadow-sm text-sm font-semibold text-gray-700 z-10">
            Original Document
          </div>
          <div className="flex-1 flex items-center justify-center relative p-8">
            {/* Visual representation of a blurred document / wireframe */}
            <div className="w-full max-w-sm aspect-[1/1.4] bg-white shadow-2xl rounded p-8 flex flex-col space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-100 rounded w-1/4 mb-4"></div>
              
              <div className="space-y-2 mt-8">
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                <div className="h-3 bg-red-100 ring-2 ring-red-400 rounded w-4/6 relative group cursor-pointer">
                  {/* Highlight for uncertainty */}
                  <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                </div>
              </div>

              <div className="mt-12 border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-100 w-1/3 rounded"></div>
                  <div className="h-3 bg-gray-100 w-1/4 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-100 w-1/2 rounded"></div>
                  <div className="h-3 bg-gray-100 w-1/4 rounded"></div>
                </div>
                <div className="flex justify-between items-center py-2 relative">
                  <div className="h-3 bg-yellow-100 ring-2 ring-yellow-400 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 w-1/4 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right pane: Extracted Data fields */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900 flex items-center">
              <Database className="w-5 h-5 mr-2 text-indigo-500" />
              Extracted Structured Data
            </h2>
            <div className="text-sm font-medium text-gray-500">
              Avg Temp: <span className="text-green-600 font-bold ml-1">94%</span> | Fields: {data.length + lineItems.length}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Header Data</h3>
              {data.map((field, idx) => (
                <div key={idx} className="relative group">
                  <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center justify-between">
                    {field.label}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center ${getConfidenceColor(field.confidence)}`}>
                      {field.confidence}%
                      {field.confidence < 90 && <AlertTriangle className="w-3 h-3 ml-1 inline" />}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateField(idx, e.target.value)}
                    className={`block w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-shadow text-gray-900 font-medium ${
                      field.confidence < 80 ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200" :
                      field.confidence < 95 ? "border-yellow-300 bg-yellow-50 focus:border-yellow-500 focus:ring-yellow-200" :
                      "border-gray-200 focus:border-[#2E7D32] focus:ring-green-100 bg-white"
                    }`}
                  />
                  {field.warning && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      {field.warning}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Line Items</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left bg-white text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700">Description</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Qty</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Price</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {lineItems.map((item, idx) => (
                      <tr key={idx} className={item.conf < 90 ? "bg-yellow-50/50" : ""}>
                        <td className="p-2">
                          <div className="relative">
                            <input 
                              value={item.desc}
                              onChange={(e) => updateLineItem(idx, 'desc', e.target.value)}
                              className={`w-full px-2 py-1.5 border rounded focus:ring-2 outline-none font-medium ${
                                item.conf < 90 ? "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-200" : "border-transparent hover:border-gray-200 focus:border-gray-300"
                              }`}
                            />
                            {item.warning && <AlertTriangle className="w-3 h-3 text-yellow-600 absolute right-2 top-2.5" title={item.warning} />}
                          </div>
                        </td>
                        <td className="p-2 w-16">
                          <input 
                            value={item.qty}
                            onChange={(e) => updateLineItem(idx, 'qty', e.target.value)}
                            className="w-full px-2 py-1.5 border border-transparent hover:border-gray-200 rounded focus:border-gray-300 focus:ring-2 outline-none font-medium"
                          />
                        </td>
                        <td className="p-2 w-24">
                          <input 
                            value={item.price}
                            onChange={(e) => updateLineItem(idx, 'price', e.target.value)}
                            className="w-full px-2 py-1.5 border border-transparent hover:border-gray-200 rounded focus:border-gray-300 focus:ring-2 outline-none font-medium"
                          />
                        </td>
                        <td className="p-2 w-28">
                          <input 
                            value={item.total}
                            onChange={(e) => updateLineItem(idx, 'total', e.target.value)}
                            className="w-full px-2 py-1.5 border border-transparent hover:border-gray-200 rounded focus:border-gray-300 focus:ring-2 outline-none font-bold text-gray-900"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Output Delivery</h2>
            <p className="text-gray-600 mb-8 font-medium">Data validated. Based on tabular content, we recommend Excel format.</p>

            <div className="space-y-3 mb-8">
              <label className="flex items-center p-4 bg-green-50 border-2 border-[#2E7D32] rounded-xl cursor-pointer">
                <input type="radio" name="export" className="text-[#2E7D32] focus:ring-[#2E7D32] h-5 w-5" defaultChecked />
                <div className="ml-4 flex items-center">
                  <div className="bg-white p-2 rounded shadow-sm mr-3 text-green-700">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Excel (.xlsx)</div>
                    <div className="text-sm text-green-700 font-semibold mt-0.5">⭐ Recommended</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer group transition-colors">
                <input type="radio" name="export" className="text-[#2E7D32] focus:ring-[#2E7D32] h-5 w-5" />
                <div className="ml-4 flex items-center">
                  <div className="bg-gray-50 border border-gray-100 p-2 rounded shadow-sm mr-3 text-gray-600 group-hover:text-gray-900 transition-colors">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">JSON Payload</div>
                    <div className="text-sm text-gray-500 font-medium">For API integration</div>
                  </div>
                </div>
              </label>

               <label className="flex items-center p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer group transition-colors">
                <input type="radio" name="export" className="text-[#2E7D32] focus:ring-[#2E7D32] h-5 w-5" />
                <div className="ml-4 flex items-center">
                  <div className="bg-gray-50 border border-gray-100 p-2 rounded shadow-sm mr-3 text-gray-600 group-hover:text-gray-900 transition-colors">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Direct DB Push</div>
                    <div className="text-sm text-gray-500 font-medium">PostgreSQL / Webhook</div>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </button>
              <button 
                onClick={handleExport}
                className="flex-[2] bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-3 rounded-lg font-bold shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                {exporting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" /> Output Structured Data
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
