import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "./_ui/Footer"; // Make sure to import your Footer component

const inter = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Showfer.ai - AI mascot for your brand",
  description: "Give a personality to your brand with Showfer.ai",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-[#F0F2F7]`}
      >
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
