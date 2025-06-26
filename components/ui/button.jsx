import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    

  const variants = {
    primaryGreen: "bg-primary/70 text-white hover:bg-primary/90 focus:ring-primary/50",
    gradientGreen:
      "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-emerald-700 hover:to-emerald-800 text-white focus:ring-emerald-500",
    primarySettings:
      "bg-gradient-to-r from-teal-200 to-teal-100 text-teal-700 shadow-sm hover:bg-primary/90 focus:ring-primary/50",
    secondaryGreen: "bg-secondary/60 text-white hover:bg-secondary/60 focus:ring-secondary/50",
    blueToGreen:
      "bg-gradient-to-r from-(--primary-light) to-secondary text-white hover:from-secondary hover:to-primary/70 focus:ring-secondary/50",
    primaryLight: "bg-(--primary-light)/90 text-white hover:bg-(--primary-light)/70 focus:ring-(--primary-light)/50",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Badge.jsx
const Badge = ({ children, color = "gray", size = "sm" }) => {
  const colors = {
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    primaryGreen: "bg-primary/10 text-primary/80",
    secondaryGreen: "bg-secondary/10 text-secondary/80",
    blue: "bg-(--primary-light)/20 text-(--primary-light)/80",
    purple: "bg-purple-100 text-purple-800",
    orange: "bg-orange-100 text-orange-800",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${colors[color]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export { Button as default, Badge };
