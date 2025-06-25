import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Contact Us | FarahGPT",
  description: "Get in touch with us for any inquiries or support",
};

const ContactPageLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default ContactPageLayout;
