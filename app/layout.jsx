import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastNotification from "./components/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Doujin Ndichan — Baca Manga & Manhwa",
  description:
    "Doujin Ndichan adalah platform baca manga, manhwa, dan komik indie dengan tampilan bersih dan minimalis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ToastNotification />
      </body>
    </html>
  );
}
