import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Hind_Siliguri, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind-siliguri",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Mahi Computer Tranning Center",
  description: "Tranning Center",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${hindSiliguri.variable} ${plusJakarta.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
};
export default RootLayout;
