import Aman from "@/app/_ui/Characters/Aman";
import Conrad from "@/app/_ui/Characters/Conrad";
import Imogen from "@/app/_ui/Characters/Imogen";
import Edison from "@/app/_ui/Characters/Edison";
import Buddy from "@/app/_ui/Characters/Buddy";
import Griffin from "@/app/_ui/Characters/Griffin";
import Grennie from "@/app/_ui/Characters/Grennie";
import Sassy from "@/app/_ui/Characters/Sassy";

export const getComponentForCharacter = (
  character: any,
  isAudioPlaying: boolean
) => {
  switch (character.id) {
    case 1:
      return (
        <Aman
          position={[0, 0, 0]}
          scale={1.5}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case 2:
      return (
        <Imogen
          position={[0, 0, 0]}
          scale={1}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case 3:
      return (
        <Conrad
          position={[0, 0, 0]}
          scale={0.8}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case 4:
      return (
        <Edison
          position={[0, 0, 0]}
          scale={1}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case 5:
      return (
        <Buddy
          position={[0, 0, 0]}
          scale={0.7}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case 6:
      return (
        <Griffin
          position={[0, 0, 0]}
          scale={0.5}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case 7:
      return (
        <Grennie
          position={[0, 0, 0]}
          scale={1}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case 8:
      return (
        <Sassy position={[0, 0, 0]} scale={1} isAudioPlaying={isAudioPlaying} />
      );
    default:
      return null;
  }
};
