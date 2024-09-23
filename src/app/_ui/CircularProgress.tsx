import React from "react";

interface CircularProgressProps {
  percentage: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  // Calculate the angle for the progress arc
  const angle = (clampedPercentage / 100) * 360;

  // Calculate the end point of the arc
  const x = 63.5 + 53.89 * Math.sin((angle * Math.PI) / 180);
  const y = 63.5 - 53.89 * Math.cos((angle * Math.PI) / 180);

  // Determine if the arc should use the large-arc-flag
  const largeArcFlag = angle > 180 ? 1 : 0;

  return (
    <svg
      width="127"
      height="127"
      viewBox="0 0 127 127"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M127 63.5C127 98.5701 98.5701 127 63.5 127C28.4299 127 0 98.5701 0 63.5C0 28.4299 28.4299 0 63.5 0C98.5701 0 127 28.4299 127 63.5ZM19.22 63.5C19.22 87.9551 39.0448 107.78 63.5 107.78C87.9551 107.78 107.78 87.9551 107.78 63.5C107.78 39.0448 87.9551 19.22 63.5 19.22C39.0448 19.22 19.22 39.0448 19.22 63.5Z"
        fill="#E3E4EC"
      />
      <path
        d={`M63.5 9.61002 A53.89 53.89 0 ${largeArcFlag} 1 ${x} ${y}`}
        fill="none"
        stroke="url(#paint0_radial_3014_8857)"
        strokeWidth="19.22"
        strokeLinecap="round"
      />
      <text
        x="63.5"
        y="70"
        textAnchor="middle"
        fill="black"
        fontSize="16"
        fontWeight="bold"
      >
        {`${clampedPercentage}%`}
      </text>
      <defs>
        <radialGradient
          id="paint0_radial_3014_8857"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(61 7) rotate(25.2405) scale(38.6943 82.7471)"
        >
          <stop stopColor="#37328B" />
          <stop offset="1" stopColor="#6D67E4" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default CircularProgress;
