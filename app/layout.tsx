import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./component/LayoutWrapper";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./component/navbar";
import Footer from "./component/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreshVeg - Fresh Fruits & Vegetables Online",
  description: "Shop fresh fruits and vegetables online at FreshVeg. Get delivery at your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
         <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
