"use client";
import ProfileSettings from "@/components/Settings/ProfileSettings";
import AccountSecurity from "@/components/Settings/AccountSecurity";
import CloseAccount from "@/components/Settings/CloseAccount";
import NotificationSettings from "@/components/Settings/NotificationSettings";
import PaymentSettings from "@/components/Settings/PaymentSettings";
import SettingsSidebar from "@/components/Settings/SettingsSidebar";
import { Menu } from "lucide-react";
import { useState } from "react";
import WithdrawFunds from "@/components/Settings/WithdrawFunds";

const AccountSettings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile-security");

  // Handle responsive behavior
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Render the active component based on selection
  const renderActiveComponent = () => {
    switch (activeSection) {
      case "profile-settings":
        return <ProfileSettings />;
      case "account-security":
        return <AccountSecurity />;
      case "withdraw-funds":
        return <WithdrawFunds />;
      case "payment-receive":
        return <PaymentReceive />;
      case "payment-settings":
        return <PaymentSettings />;
      case "notification-settings":
        return <NotificationSettings />;
      case "close-account":
        return <CloseAccount />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SettingsSidebar
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 shadow">
          <h1 className="text-xl text-white font-semibold">Account Settings</h1>
          <button className="p-2 text-white hover:text-gray-300 lg:hidden" onClick={handleToggleSidebar}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto bg-gray-50">{renderActiveComponent()}</div>
      </div>
    </div>
  );
};

export default AccountSettings;
