"use client";

import { useState } from "react";
import { Settings, FileText, Globe, Bell, Trash2, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const exportFormats = [
  { value: "xlsx", label: "Microsoft Excel (.xlsx)", desc: "Recommended for spreadsheets" },
  { value: "csv", label: "CSV (.csv)", desc: "Universal format, lightweight" },
  { value: "json", label: "JSON (.json)", desc: "For API integrations" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ar", label: "العربية" },
];

export default function SettingsPage() {
  const { showToast } = useApp();
  const [saving, setSaving] = useState(false);
  const [defaultFormat, setDefaultFormat] = useState("xlsx");
  const [language, setLanguage] = useState("en");
  const [notifyProcessing, setNotifyProcessing] = useState(true);
  const [notifyLowBalance, setNotifyLowBalance] = useState(true);
  const [notifyExport, setNotifyExport] = useState(false);
  const [autoDelete, setAutoDelete] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Settings saved successfully", "success");
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">General Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Configure your default preferences.</p>
      </div>

      {/* Default Export Format */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#2E7D32]" />
            Default Export Format
          </h2>
        </div>
        <div className="p-6 space-y-3">
          {exportFormats.map((fmt) => (
            <label
              key={fmt.value}
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                defaultFormat === fmt.value
                  ? "border-[#2E7D32] bg-[#E8F5E9]"
                  : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
            >
              <input
                type="radio"
                name="format"
                value={fmt.value}
                checked={defaultFormat === fmt.value}
                onChange={(e) => setDefaultFormat(e.target.value)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                defaultFormat === fmt.value ? "border-[#2E7D32]" : "border-gray-300"
              }`}>
                {defaultFormat === fmt.value && <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{fmt.label}</div>
                <div className="text-xs text-gray-400">{fmt.desc}</div>
              </div>
              {defaultFormat === fmt.value && (
                <CheckCircle2 className="w-5 h-5 text-[#2E7D32] ml-auto" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-[#1976D2]" />
            Language
          </h2>
        </div>
        <div className="p-6">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#1976D2]/5 focus:border-[#1976D2] outline-none font-bold text-sm appearance-none cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-purple-600" />
            Notification Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Processing Complete", desc: "Notify when document processing finishes", state: notifyProcessing, setter: setNotifyProcessing },
            { label: "Low Balance Warning", desc: "Alert when credits are running low", state: notifyLowBalance, setter: setNotifyLowBalance },
            { label: "Export Ready", desc: "Notify when export is ready for download", state: notifyExport, setter: setNotifyExport },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="text-sm font-bold text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
              </div>
              <button
                onClick={() => item.setter(!item.state)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  item.state ? "bg-[#2E7D32]" : "bg-gray-200"
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  item.state ? "left-6" : "left-1"
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Delete */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Trash2 className="w-5 h-5 mr-2 text-red-500" />
            Data Management
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="text-sm font-bold text-gray-900">Auto-Delete Files</div>
              <div className="text-xs text-gray-400 mt-0.5">Automatically delete processed files after 30 days</div>
            </div>
            <button
              onClick={() => setAutoDelete(!autoDelete)}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                autoDelete ? "bg-[#2E7D32]" : "bg-gray-200"
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                autoDelete ? "left-6" : "left-1"
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
        Save All Settings
      </button>
    </div>
  );
}
