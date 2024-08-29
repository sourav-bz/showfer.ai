import Image from "next/image";
import VoiceOrb from "./VoiceOrb";

export default function VoiceInterface() {
  return (
    <div className="h-full p-6 flex flex-col justify-center items-center">
      <div className="mb-8">
        <VoiceOrb width={200} height={200} />
      </div>
      <Image src={"./playground/mic.svg"} width={70} height={70} alt="mic" />
    </div>
  );
}
