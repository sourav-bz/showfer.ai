import Image from "next/image";
import Navbar from "./_ui/Navbar";
import Hero from "./_ui/Hero";
import Footer from "./_ui/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen h-screen p-4">
      <Navbar />
      <Hero />
    </main>
  );
}
