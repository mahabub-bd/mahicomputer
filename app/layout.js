import { Footer, Navbar } from "./components";
import "./globals.css";



export const metadata = {
  title: "Mahi Computer",
  description: "App For Qcash Member Banks",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
     
      </body>
    </html>
  );
};
export default RootLayout;
