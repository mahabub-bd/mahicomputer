import { Footer, Navbar } from "./components";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mahi Computer Tranning Center",
  description: "Tranning Center",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
};
export default RootLayout;
