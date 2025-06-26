"use client";
import { useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import Button from "../ui/button";

const AccountSecurity = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    console.log("Updating password:", passwords);
    // Reset form after successful update
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="p-4 mb-18 sm:p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Security</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6">Change Password</h3>

        <div className="space-y-4 max-w-md">
          {["currentPassword", "newPassword", "confirmPassword"].map((field) => {
            const labelMap = {
              currentPassword: "Current Password",
              newPassword: "New Password",
              confirmPassword: "Confirm New Password",
            };

            const fieldKey = field.split("Password")[0];

            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{labelMap[field]}</label>
                <div className="relative">
                  <input
                    type={showPasswords[fieldKey] ? "text" : "password"}
                    name={field}
                    value={passwords[field]}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(fieldKey)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords[fieldKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}

          <Button variant="primarySettings" onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2 inline" />
            Update Password
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">Password Requirements</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains at least one uppercase letter</li>
            <li>• Contains at least one lowercase letter</li>
            <li>• Contains at least one number</li>
            <li>• Contains at least one special character</li>
          </ul>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-600 mb-4">
            Enable two-factor authentication for added security. This will require a verification code sent to your
            email or phone each time you log in.
          </p>
          <Button variant="primarySettings" onClick={() => alert("Two-Factor Authentication is not implemented yet.")}>
            Enable 2FA
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;
