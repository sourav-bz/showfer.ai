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
  storyState: "user" | "assistant" | "neutral"
) => {
  switch (character.id) {
    case 1:
      return <Aman position={[0, 0, 0]} scale={1.5} storyState={storyState} />;
    case 2:
      return <Imogen position={[0, 0, 0]} scale={1} storyState={storyState} />;
    case 3:
      return (
        <Conrad position={[0, 0, 0]} scale={0.8} storyState={storyState} />
      );
    case 4:
      return <Edison position={[0, 0, 0]} scale={1} storyState={storyState} />;
    case 5:
      return <Buddy position={[0, 0, 0]} scale={0.7} storyState={storyState} />;
    case 6:
      return (
        <Griffin position={[0, 0, 0]} scale={0.5} storyState={storyState} />
      );
    case 7:
      return <Grennie position={[0, 0, 0]} scale={1} storyState={storyState} />;
    case 8:
      return <Sassy position={[0, 0, 0]} scale={1} storyState={storyState} />;
    default:
      return null;
  }
};
