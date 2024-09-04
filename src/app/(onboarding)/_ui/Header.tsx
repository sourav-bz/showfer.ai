import Image from "next/image";

export default function Header() {
  return (
    <header className="p-4 bg-white shadow-sm mb-[14px] rounded-lg">
      <div className="container mx-auto">
        <Image
          src="/brand-logo/dark.svg"
          alt="Showfer.ai Logo"
          width={120}
          height={40}
          priority
        />
      </div>
    </header>
  );
}
