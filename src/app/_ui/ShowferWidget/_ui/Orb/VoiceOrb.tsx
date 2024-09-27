import React from "react";

const VoiceOrb = ({
  width = 405,
  height = 405,
  blurBallOffset = 600,
  rotationDuration = 10,
  color = "#6D67E4",
  pulseDuration = 2, // New prop for controlling pulse speed
}) => {
  // Calculate scale based on provided width (assuming width and height are equal)
  const scale = width / 1350;

  return (
    <div
      className="relative pulsating-orb"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 1350 1350"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient
            id="paint0_radial_2311_9952"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(675 675) rotate(90) scale(898.5)"
          >
            <stop offset="0.356469" stopColor="white" />
            <stop offset="1" stopColor={color} />
          </radialGradient>
          <clipPath id="ring-clip">
            <circle cx="675" cy="675" r="675" />
          </clipPath>
          <filter
            id="filter0_f_2311_9954"
            x="0.899994"
            y="0.899994"
            width="1561.2"
            height="1561.2"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="101.05"
              result="effect1_foregroundBlur_2311_9954"
            />
          </filter>
          <filter
            id="filter0_f_2311_9941"
            x="10"
            y="10"
            width="1328.4"
            height="1328.4"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="43.1"
              result="effect1_foregroundBlur_2311_9941"
            />
          </filter>
        </defs>

        {/* Ring */}
        <circle
          cx="675"
          cy="675"
          r="675"
          fill="url(#paint0_radial_2311_9952)"
        />

        {/* Clipped Rotating Blur Ball */}
        <g clipPath="url(#ring-clip)">
          <g className="rotating-blur">
            <g filter="url(#filter0_f_2311_9954)">
              <circle
                cx={675 + blurBallOffset}
                cy="675"
                r="578.5"
                fill={color}
              />
            </g>
          </g>
        </g>

        {/* Centered White Blur Ball */}
        <g filter="url(#filter0_f_2311_9941)">
          <circle cx="675" cy="675" r="578" fill="white" fillOpacity="0.83" />
        </g>
      </svg>
      <style jsx>{`
        .pulsating-orb {
          animation: pulse ${pulseDuration}s ease-in-out infinite;
        }
        .rotating-blur {
          animation: rotate ${rotationDuration}s linear infinite;
          transform-origin: 675px 675px;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceOrb;
