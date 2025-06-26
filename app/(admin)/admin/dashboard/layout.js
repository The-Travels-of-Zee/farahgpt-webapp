import DashboardHeader from "@/components/Dashboard/DashboardNavbar";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Dashboard",
  description: "User dashboard with stats, settings, and more",
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="admin-dashboard-layout">
      <DashboardHeader />
      {/* <Navbar /> */}
      <main className="admin-dashboard-layout">{children}</main>
    </div>
  );
};

export default DashboardLayout;
