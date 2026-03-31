"use client";

import { useState } from "react";
import { User, Mail, Lock, Shield, Trash2, Save, Loader2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function AccountSettingsPage() {
  const { user, showToast } = useApp();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [name, setName] = useState(user?.user_metadata?.name || "Account User");
  const [email, setEmail] = useState(user?.email || "user@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Profile updated successfully", "success");
    }, 800);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password changed successfully", "success");
    }, 800);
  };

  const handleDeleteAccount = async () => {
    showToast("Account deletion is disabled in demo mode", "info");
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage your personal information and security.</p>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-[#2E7D32]" />
            Personal Information
          </h2>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#2E7D32]/5 focus:border-[#2E7D32] outline-none font-bold text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#2E7D32]/5 focus:border-[#2E7D32] outline-none font-bold text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-[#1976D2]" />
            Change Password
          </h2>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#1976D2]/5 focus:border-[#1976D2] outline-none font-bold text-sm pr-11"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#1976D2]/5 focus:border-[#1976D2] outline-none font-bold text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#1976D2]/5 focus:border-[#1976D2] outline-none font-bold text-sm"
            />
          </div>
          <button
            onClick={handleChangePassword}
            disabled={saving || !currentPassword || !newPassword || !confirmPassword}
            className="bg-[#1976D2] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
            Update Password
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-purple-600" />
            Security
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="text-sm font-bold text-gray-900">Two-Factor Authentication</div>
              <div className="text-xs text-gray-400 mt-0.5">Add an extra layer of security</div>
            </div>
            <button className="text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] uppercase tracking-widest">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="text-sm font-bold text-gray-900">Active Sessions</div>
              <div className="text-xs text-gray-400 mt-0.5">Manage your active sessions</div>
            </div>
            <button className="text-xs font-bold text-[#1976D2] hover:text-blue-700 uppercase tracking-widest">
              View
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-red-50 bg-red-50/30">
          <h2 className="text-lg font-bold text-red-600 flex items-center">
            <Trash2 className="w-5 h-5 mr-2" />
            Danger Zone
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
          {showDeleteConfirm ? (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-3">
              <div className="flex items-center text-red-600 text-sm font-bold">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Are you absolutely sure?
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
