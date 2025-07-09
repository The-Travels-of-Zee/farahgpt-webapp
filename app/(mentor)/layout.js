import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Instructor Dashboard",
  description: "Instructor dashboard with stats, settings, and more",
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-content">{children}</main>
    </div>
  );
};

export default DashboardLayout;
