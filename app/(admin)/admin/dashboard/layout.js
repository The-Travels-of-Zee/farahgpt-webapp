import AdminNavbar from "@/components/Admin/AdminNavbar";

export const metadata = {
  title: "Dashboard",
  description: "User dashboard with stats, settings, and more",
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="admin-dashboard-layout">
      <AdminNavbar />
      <main className="admin-dashboard-layout">{children}</main>
    </div>
  );
};

export default DashboardLayout;
