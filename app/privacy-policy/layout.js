import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Privacy Policy | FarahGPT",
  description: "Privacy Policy for FarahGPT",
};

const PrivacyPolicyLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyLayout;
