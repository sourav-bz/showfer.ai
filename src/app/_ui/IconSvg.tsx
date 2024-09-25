import React from "react";

interface IconSVGProps {
  name:
    | "voice"
    | "message-text"
    | "mic"
    | "play"
    | "bullet"
    | "mobile-orb-bg"
    | "send";
  color: string;
  className?: string; // Add className prop
}

const IconSVG: React.FC<IconSVGProps> = ({ name, color, className }) => {
  const icons = {
    voice: (
      <svg
        width="18"
        height="19"
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className} // Add className here
      >
        <path
          d="M12.143 2.14221H5.85805C3.12805 2.14221 1.50055 3.76971 1.50055 6.49971V12.7772C1.50055 15.5147 3.12805 17.1422 5.85805 17.1422H12.1355C14.8656 17.1422 16.493 15.5147 16.493 12.7847V6.49971C16.5005 3.76971 14.873 2.14221 12.143 2.14221ZM5.06305 11.2472C5.06305 11.5547 4.80805 11.8097 4.50055 11.8097C4.19305 11.8097 3.93805 11.5547 3.93805 11.2472V8.03721C3.93805 7.72971 4.19305 7.47471 4.50055 7.47471C4.80805 7.47471 5.06305 7.72971 5.06305 8.03721V11.2472ZM7.31305 12.3197C7.31305 12.6272 7.05805 12.8822 6.75055 12.8822C6.44305 12.8822 6.18805 12.6272 6.18805 12.3197V6.96471C6.18805 6.65721 6.44305 6.40221 6.75055 6.40221C7.05805 6.40221 7.31305 6.65721 7.31305 6.96471V12.3197ZM9.56305 13.3922C9.56305 13.6997 9.30805 13.9547 9.00055 13.9547C8.69305 13.9547 8.43805 13.6997 8.43805 13.3922V5.89221C8.43805 5.58471 8.69305 5.32971 9.00055 5.32971C9.30805 5.32971 9.56305 5.58471 9.56305 5.89221V13.3922ZM11.813 12.3197C11.813 12.6272 11.558 12.8822 11.2505 12.8822C10.943 12.8822 10.688 12.6272 10.688 12.3197V6.96471C10.688 6.65721 10.943 6.40221 11.2505 6.40221C11.558 6.40221 11.813 6.65721 11.813 6.96471V12.3197ZM14.063 11.2472C14.063 11.5547 13.808 11.8097 13.5005 11.8097C13.193 11.8097 12.938 11.5547 12.938 11.2472V8.03721C12.938 7.72971 13.193 7.47471 13.5005 7.47471C13.808 7.47471 14.063 7.72971 14.063 8.03721V11.2472Z"
          fill={color}
        />
      </svg>
    ),
    "message-text": (
      <svg
        width="18"
        height="19"
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className} // Add className here
      >
        <path
          d="M12.7505 2.14221H5.25049C3.18049 2.14221 1.50049 3.81471 1.50049 5.87721V10.3622V11.1122C1.50049 13.1747 3.18049 14.8472 5.25049 14.8472H6.37549C6.57799 14.8472 6.84799 14.9822 6.97549 15.1472L8.10049 16.6397C8.59549 17.2997 9.40549 17.2997 9.90049 16.6397L11.0255 15.1472C11.168 14.9597 11.393 14.8472 11.6255 14.8472H12.7505C14.8205 14.8472 16.5005 13.1747 16.5005 11.1122V5.87721C16.5005 3.81471 14.8205 2.14221 12.7505 2.14221ZM9.75049 10.9547H5.25049C4.94299 10.9547 4.68799 10.6997 4.68799 10.3922C4.68799 10.0847 4.94299 9.82971 5.25049 9.82971H9.75049C10.058 9.82971 10.313 10.0847 10.313 10.3922C10.313 10.6997 10.058 10.9547 9.75049 10.9547ZM12.7505 7.20471H5.25049C4.94299 7.20471 4.68799 6.94971 4.68799 6.64221C4.68799 6.33471 4.94299 6.07971 5.25049 6.07971H12.7505C13.058 6.07971 13.313 6.33471 13.313 6.64221C13.313 6.94971 13.058 7.20471 12.7505 7.20471Z"
          fill={color}
        />
      </svg>
    ),
    mic: (
      <svg
        width="79"
        height="79"
        viewBox="0 0 79 79"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle
          opacity="0.19"
          cx="39.5"
          cy="39.5"
          r="39.1792"
          stroke={color}
          strokeWidth="0.641667"
        />
        <circle
          cx="39.5"
          cy="39.5"
          r="31.25"
          stroke={color}
          strokeWidth="0.5"
        />
        <g filter="url(#filter0_d_538_13518)">
          <rect x="14.5" y="14.5" width="50" height="50" rx="25" fill="white" />
          <g clipPath="url(#clip0_538_13518)">
            <path
              d="M32.75 37.25C32.9489 37.25 33.1397 37.329 33.2803 37.4697C33.421 37.6103 33.5 37.8011 33.5 38V39.5C33.5 41.0913 34.1321 42.6174 35.2574 43.7426C36.3826 44.8679 37.9087 45.5 39.5 45.5C41.0913 45.5 42.6174 44.8679 43.7426 43.7426C44.8679 42.6174 45.5 41.0913 45.5 39.5V38C45.5 37.8011 45.579 37.6103 45.7197 37.4697C45.8603 37.329 46.0511 37.25 46.25 37.25C46.4489 37.25 46.6397 37.329 46.7803 37.4697C46.921 37.6103 47 37.8011 47 38V39.5C47 41.3593 46.3094 43.1523 45.0622 44.5312C43.8149 45.9101 42.1 46.7766 40.25 46.9625V50H44.75C44.9489 50 45.1397 50.079 45.2803 50.2197C45.421 50.3603 45.5 50.5511 45.5 50.75C45.5 50.9489 45.421 51.1397 45.2803 51.2803C45.1397 51.421 44.9489 51.5 44.75 51.5H34.25C34.0511 51.5 33.8603 51.421 33.7197 51.2803C33.579 51.1397 33.5 50.9489 33.5 50.75C33.5 50.5511 33.579 50.3603 33.7197 50.2197C33.8603 50.079 34.0511 50 34.25 50H38.75V46.9625C36.9 46.7766 35.1851 45.9101 33.9378 44.5312C32.6906 43.1523 32 41.3593 32 39.5V38C32 37.8011 32.079 37.6103 32.2197 37.4697C32.3603 37.329 32.5511 37.25 32.75 37.25Z"
              fill={color}
            />
            <path
              d="M42.5 39.5C42.5 40.2956 42.1839 41.0587 41.6213 41.6213C41.0587 42.1839 40.2956 42.5 39.5 42.5C38.7044 42.5 37.9413 42.1839 37.3787 41.6213C36.8161 41.0587 36.5 40.2956 36.5 39.5V32C36.5 31.2044 36.8161 30.4413 37.3787 29.8787C37.9413 29.3161 38.7044 29 39.5 29C40.2956 29 41.0587 29.3161 41.6213 29.8787C42.1839 30.4413 42.5 31.2044 42.5 32V39.5ZM39.5 27.5C38.3065 27.5 37.1619 27.9741 36.318 28.818C35.4741 29.6619 35 30.8065 35 32V39.5C35 40.6935 35.4741 41.8381 36.318 42.682C37.1619 43.5259 38.3065 44 39.5 44C40.6935 44 41.8381 43.5259 42.682 42.682C43.5259 41.8381 44 40.6935 44 39.5V32C44 30.8065 43.5259 29.6619 42.682 28.818C41.8381 27.9741 40.6935 27.5 39.5 27.5Z"
              fill={color}
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_d_538_13518"
            x="5.5"
            y="5.5"
            width="68"
            height="68"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="4.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.121498 0 0 0 0 0.110331 0 0 0 0 0.274115 0 0 0 0.13 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_538_13518"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_538_13518"
              result="shape"
            />
          </filter>
          <clipPath id="clip0_538_13518">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(27.5 27.5)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
    play: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="23"
        viewBox="0 0 21 23"
        fill="none"
        className={className} // Add className here
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.634 14.746C21.1315 13.303 21.1315 9.69699 18.634 8.25249L5.8765 0.87699C3.3775 -0.56751 0.25 1.23699 0.25 4.12449V18.8755C0.25 21.763 3.3775 23.5675 5.8765 22.1215L18.634 14.746Z"
          fill={color}
        />
      </svg>
    ),
    bullet: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="7"
        height="7"
        viewBox="0 0 7 7"
        fill="none"
        className={className}
      >
        <circle
          cx="3.5"
          cy="3.5"
          r="3.5"
          transform="matrix(1 0 0 -1 0 7)"
          fill={color}
        />
      </svg>
    ),
    "mobile-orb-bg": (
      <svg
        width="98"
        height="98"
        viewBox="0 0 98 98"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <g filter="url(#filter0_i)">
          <circle cx="48.6639" cy="48.6637" r="48.351" fill="white" />
        </g>
        <mask
          id="mask0"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="98"
          height="98"
        >
          <circle cx="48.6639" cy="48.6637" r="48.351" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0)">
          <g filter="url(#filter1_f)">
            <circle
              cx="84.0917"
              cy="19.6239"
              r="43.6949"
              fill={color}
              fillOpacity="0.8"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_i"
            x="0.312988"
            y="0.312744"
            width="96.7019"
            height="96.7019"
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
            <feOffset />
            <feGaussianBlur stdDeviation="25.0709" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 ${
                parseInt(color.slice(1, 3), 16) / 255
              } 0 0 0 0 ${parseInt(color.slice(3, 5), 16) / 255} 0 0 0 0 ${
                parseInt(color.slice(5, 7), 16) / 255
              } 0 0 0 1 0`}
            />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
          </filter>
          <filter
            id="filter1_f"
            x="21.9159"
            y="-42.5519"
            width="124.352"
            height="124.352"
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
              stdDeviation="9.2404"
              result="effect1_foregroundBlur"
            />
          </filter>
        </defs>
      </svg>
    ),
    send: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        className={className}
      >
        <path
          d="M18.0698 9.00989L9.50978 4.72989C3.75978 1.84989 1.39978 4.20989 4.27978 9.95989L5.14978 11.6999C5.39978 12.2099 5.39978 12.7999 5.14978 13.3099L4.27978 15.0399C1.39978 20.7899 3.74978 23.1499 9.50978 20.2699L18.0698 15.9899C21.9098 14.0699 21.9098 10.9299 18.0698 9.00989ZM14.8398 13.2499H9.43977C9.02978 13.2499 8.68977 12.9099 8.68977 12.4999C8.68977 12.0899 9.02978 11.7499 9.43977 11.7499H14.8398C15.2498 11.7499 15.5898 12.0899 15.5898 12.4999C15.5898 12.9099 15.2498 13.2499 14.8398 13.2499Z"
          fill={color}
        />
      </svg>
    ),
  };

  return icons[name];
};

export default IconSVG;
