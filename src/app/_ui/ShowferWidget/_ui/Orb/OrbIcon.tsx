import React from "react";

interface AnimatedOrbProps {
  width?: number;
  height?: number;
  primaryColor?: string;
}

const OrbIcon: React.FC<AnimatedOrbProps> = ({
  width = 500,
  height = 500,
  primaryColor = "#FFD700", // Default to yellow if no color is provided
}) => {
  const scale = Math.min(width, height) / 500;

  // Function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : null;
  };

  const rgbColor = hexToRgb(primaryColor);
  const colorMatrix = rgbColor
    ? `0 0 0 0 ${rgbColor.r} 0 0 0 0 ${rgbColor.g} 0 0 0 0 ${rgbColor.b} 0 0 0 0.8 0`
    : "0 0 0 0 1 0 0 0 0 0.843137 0 0 0 0 0 0 0 0 0.8 0";

  return (
    <div className="orb-container">
      <svg
        className="background-svg"
        width={width}
        height={height}
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_i_2261_4137)">
          <path
            d="M999.922 508.726C995.103 784.826 767.373 1004.74 491.274 999.922C215.174 995.103 -4.74161 767.373 0.0777201 491.274C4.89705 215.174 232.627 -4.74161 508.726 0.0777201C784.826 4.89705 1004.74 232.627 999.922 508.726Z"
            fill="white"
          />
        </g>
        <defs>
          <filter
            id="filter0_i_2261_4137"
            x="0"
            y="0"
            width="1000"
            height="1000"
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
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="100"
              operator="erode"
              in="SourceAlpha"
              result="effect1_innerShadow_2261_4137"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="150" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values={colorMatrix} />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_2261_4137"
            />
          </filter>
        </defs>
      </svg>
      <div className="orb">
        <svg
          className="shape shape1"
          viewBox="0 0 460 475"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M205.339 0.77757C296.836 11.7005 477.656 169.815 457.833 335.863C438.01 501.912 241.165 478.027 149.669 467.104C58.1724 456.181 -16.0454 447.707 3.77772 281.658C23.6008 115.609 113.843 -10.1454 205.339 0.77757Z"
            fill={`url(#paint0_linear_2261_4132)`}
          />
          <defs>
            <linearGradient
              id="paint0_linear_2261_4132"
              x1="-24.4335"
              y1="470.023"
              x2="443.04"
              y2="212.808"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={primaryColor} />
              <stop offset="1" stopColor={primaryColor} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="shape shape2"
          viewBox="0 0 460 475"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M205.339 0.77757C296.836 11.7005 477.656 169.815 457.833 335.863C438.01 501.912 241.165 478.027 149.669 467.104C58.1724 456.181 -16.0454 447.707 3.77772 281.658C23.6008 115.609 113.843 -10.1454 205.339 0.77757Z"
            fill={`url(#paint1_linear_2261_4132)`}
          />
          <defs>
            <linearGradient
              id="paint1_linear_2261_4132"
              x1="-24.4335"
              y1="470.023"
              x2="443.04"
              y2="212.808"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={primaryColor} />
              <stop offset="1" stopColor={primaryColor} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="shape shape3"
          viewBox="0 0 460 475"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M205.339 0.77757C296.836 11.7005 477.656 169.815 457.833 335.863C438.01 501.912 241.165 478.027 149.669 467.104C58.1724 456.181 -16.0454 447.707 3.77772 281.658C23.6008 115.609 113.843 -10.1454 205.339 0.77757Z"
            fill={`url(#paint2_linear_2261_4132)`}
          />
          <defs>
            <linearGradient
              id="paint2_linear_2261_4132"
              x1="-24.4335"
              y1="470.023"
              x2="443.04"
              y2="212.808"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={primaryColor} />
              <stop offset="1" stopColor={primaryColor} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <style jsx>{`
        .orb-container {
          width: ${width}px;
          height: ${height}px;
          position: relative;
          overflow: hidden;
        }

        .background-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .orb {
          width: 100%;
          height: 100%;
          position: relative;
          animation: rotate 20s linear infinite;
        }

        .shape {
          position: absolute;
          width: ${250 * scale}px;
          height: ${250 * scale}px;
          opacity: 0.7;
        }

        .shape1 {
          top: 15%;
          left: 15%;
          transform: rotate(160deg);
          animation: morph1 8s ease-in-out infinite alternate;
        }

        .shape2 {
          top: 15%;
          right: 15%;
          transform: rotate(-160deg);
          animation: morph2 12s ease-in-out infinite alternate;
        }

        .shape3 {
          bottom: 15%;
          left: 25%;
          transform: rotate(20deg);
          animation: morph3 10s ease-in-out infinite alternate;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes morph1 {
          0% {
            transform: rotate(160deg) scale(1) translate(0, 0);
          }
          100% {
            transform: rotate(160deg) scale(1.1)
              translate(${20 * scale}px, ${20 * scale}px);
          }
        }

        @keyframes morph2 {
          0% {
            transform: rotate(-160deg) scale(1) translate(0, 0);
          }
          100% {
            transform: rotate(-160deg) scale(0.9)
              translate(${-20 * scale}px, ${20 * scale}px);
          }
        }

        @keyframes morph3 {
          0% {
            transform: rotate(20deg) scale(1) translate(0, 0);
          }
          100% {
            transform: rotate(20deg) scale(1.05)
              translate(${20 * scale}px, ${-20 * scale}px);
          }
        }
      `}</style>
    </div>
  );
};

export default OrbIcon;
