import DashboardHeader from "@/components/Dashboard/DashboardNavbar";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Dashboard",
  description: "User dashboard with stats, settings, and more",
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      {/* <DashboardHeader /> */}
      <Navbar />
      <main className="dashboard-content">{children}</main>
    </div>
  );
};

export default DashboardLayout;
