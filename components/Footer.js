"use client";
import { Mail, MapPin } from "lucide-react";
import { bottomLinks, footerSections, socialLinks } from "@/constants";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  const socialVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  return (
    <motion.footer
      className="bg-gradient-to-br from-white to-slate-50 border-t border-slate-200"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:place-items-end lg:items-center lg:gap-16 mb-12">
          {/* Brand Section */}
          <motion.div className="lg:col-span-4 xl:col-span-3" variants={sectionVariants}>
            <motion.div
              className="flex items-center gap-2 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src="/favicon/favicon.svg" width={64} height={64} alt="farahgpt-logo" className="inline" />
              <h2 className="text-2xl font-bold text-emerald-600">FarahGPT</h2>
            </motion.div>

            <p className="text-slate-600 mb-6 max-w-xs leading-relaxed">
              Your AI-powered Islamic companion for learning and spiritual guidance
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <motion.div
                className="flex items-center gap-3 text-slate-600"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">info@thetravelsofzee.com</span>
              </motion.div>
              {/* <motion.div
                className="flex items-center gap-3 text-slate-600"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </motion.div> */}
              <motion.div
                className="flex items-start gap-3 text-slate-600"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">28 Wenlock Road, London, England N17GU, GB</span>
              </motion.div>
            </div>

            {/* Social Links */}
            <motion.ul
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="list-none flex gap-4 my-6 p-0 w-full"
            >
              <li className="m-0 p-0">
                <Link
                  href={"https://play.google.com/store/apps/details?id=com.app.farahgpt"}
                  target="_blank"
                  rel="noopener"
                >
                  <img className="h-14" alt="google play logo" src="/stores/google-play.svg" />
                </Link>
              </li>
              <li className="m-0 p-0" rel="noopener">
                <Link href={"https://apps.apple.com/us/app/farahgpt/id6746275409"} target="_blank">
                  <img className="h-14" alt="app store logo" src="/stores/app-store.svg" />
                </Link>
              </li>
            </motion.ul>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors duration-300"
                    variants={socialVariants}
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { type: "spring", stiffness: 300 },
                    }}
                    whileTap={{ scale: 0.95 }}
                    custom={index}
                  >
                    <IconComponent className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Sections in 2 columns */}

          <div className="lg:col-span-8 xl:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {footerSections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div key={section.title} className="space-y-5" variants={sectionVariants} custom={index}>
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold text-slate-800 text-lg">{section.title}</h3>
                  </div>

                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <motion.li key={link.name} variants={linkVariants} custom={linkIndex}>
                        <motion.a
                          href={link.href}
                          className="text-slate-600 hover:text-emerald-600 text-sm transition-colors duration-200 block py-1.5 leading-relaxed"
                          whileHover={{
                            x: 5,
                            transition: { type: "spring", stiffness: 300 },
                          }}
                        >
                          {link.name}
                        </motion.a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer Bottom */}
        <motion.div className="border-t border-slate-200 pt-8" variants={sectionVariants}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.p
              className="text-slate-600 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              © 2025 FarahGPT. All rights reserved. Built with ❤️ for the Ummah.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {bottomLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-slate-600 hover:text-emerald-600 text-sm transition-colors duration-200"
                  whileHover={{
                    y: -2,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  {link.name}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
