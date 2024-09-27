import IconSVG from "@/app/_ui/IconSvg";

export default function VoiceStart({
  color,
  disable,
  onClick,
  className,
}: {
  color: string;
  disable: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={`flex items-center justify-center cursor-pointer bg-white rounded-full p-[5px] ${className}`}
      style={{
        boxShadow: `0px 0px 9px 0px rgba(31, 28, 70, 0.13)`,
      }}
      disabled={disable}
      onClick={onClick}
    >
      <div
        className="p-1 rounded-full"
        style={{
          backgroundColor: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
            color.slice(3, 5),
            16
          )}, ${parseInt(color.slice(5, 7), 16)}, 0.3)`,
        }}
      >
        <IconSVG name="call" color={color} />
      </div>

      <div className="ml-2 text-sm font-medium mr-1" style={{ color: color }}>
        Start
      </div>
    </button>
  );
}
