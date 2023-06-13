import { Footer, Navbar } from "./components";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";


export const metadata = {
  title: "Mahi Computer",
  description: "Tranning Center",
};

const RootLayout = ({ children }) => {
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
