import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "FarahGPT",
  description: "Islamic Mentorship Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/favicon/apple-icon.png" sizes="180x180" />
        <link rel="icon" href="/favicon/favicon-192x192.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/favicon/favicon-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/favicon/favicon-512x512.png" sizes="512x512" type="image/png" />
        <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" sizes="any" />
        <link rel="manifest" href="/favicon/manifest.json" />
      </head>
      <body className={"font-notosans antialiased"}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
