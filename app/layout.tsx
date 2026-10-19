import { SITE_NAME, SITE_URL, truncate } from "@/lib/site";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Hind_Siliguri, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  // 300 was only used by the marquee strip (now font-normal); 500 stays —
  // it backs ~60 font-medium spots across the admin and site UI.
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind-siliguri",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

const SITE_DESCRIPTION = truncate(
  "Mahi Computer Training Center offers practical computer and IT courses — office applications, graphic design, web development, CAD, hardware and more. Expert instructors, hands-on training and certification.",
);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Computer & IT Courses`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Mahi Computer Training Center",
    "computer training center",
    "computer courses",
    "IT training",
    "graphic design course",
    "web development course",
    "office application course",
    "AutoCAD course",
    "computer hardware course",
    "freelancing course",
    "digital marketing course",
    "spoken English course",
    "computer education Bangladesh",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  category: "education",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Computer & IT Courses`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/hero.jpg",
        width: 2000,
        height: 1199,
        alt: "Mahi Computer Training Center campus and students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Computer & IT Courses`,
    description: SITE_DESCRIPTION,
    images: ["/uploads/1792310963250-67078284e0f7.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.ico" },
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${hindSiliguri.variable} ${plusJakarta.variable}`}
    >
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
};
export default RootLayout;
