"use client";
import { useState, useEffect } from "react";
import Navbar from "./_ui/Navbar";
import Hero from "./_ui/Hero";
import HeroMobile from "./_ui/HeroMobile";
import { useRouter } from "next/navigation";
import { analytics } from "@/app/firebase";
import { logEvent } from "firebase/analytics";
import { usePathname } from "next/navigation";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (analytics) {
        logEvent(analytics, "page_view", {
          page_path: url,
        });
      }
    };

    handleRouteChange(pathname);
  }, [pathname]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this breakpoint as needed
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <main className="flex flex-col min-h-screen h-screen p-4">
      <Navbar />
      {isMobile ? <HeroMobile /> : <Hero />}
    </main>
  );
}
