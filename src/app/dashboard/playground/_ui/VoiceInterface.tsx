import Image from "next/image";

export default function VoiceInterface() {
  return (
    <div className="h-full p-6 flex flex-col justify-center items-center">
      <Image
        src={"./playground/circular-orb.svg"}
        alt="orb"
        width={300}
        height={300}
      />
      <Image src={"./playground/mic.svg"} width={70} height={70} alt="mic" />
    </div>
  );
}
