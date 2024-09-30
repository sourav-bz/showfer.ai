import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import Header from "./_ui/Header";

const inter = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Showfer.ai - AI mascot for your brand",
  description: "Give a personality to your brand website with Showfer.ai",
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
        className={`${inter.className} flex flex-col h-screen bg-[#F0F2F7] p-[14px] `}
      >
        <Header />
        <div className="flex-grow">{children}</div>
      </body>
    </html>
  );
}
