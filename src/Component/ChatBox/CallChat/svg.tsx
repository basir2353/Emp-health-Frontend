import React from "react";

const Mic1: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" fill="white" />
    <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#91D5FF" />
    <path
      d="M22 25.5C24.21 25.5 26 23.71 26 21.5V16C26 13.79 24.21 12 22 12C19.79 12 18 13.79 18 16V21.5C18 23.71 19.79 25.5 22 25.5Z"
      stroke="#313131"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.3496 19.6504V21.3504C14.3496 25.5704 17.7796 29.0004 21.9996 29.0004C26.2196 29.0004 29.6496 25.5704 29.6496 21.3504V19.6504"
      stroke="#313131"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.6094 16.4301C21.5094 16.1001 22.4894 16.1001 23.3894 16.4301"
      stroke="#313131"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.1992 18.5503C21.7292 18.4103 22.2792 18.4103 22.8092 18.5503"
      stroke="#313131"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 29V32"
      stroke="#313131"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Mic2: React.FC = () => (
  <svg width="56" height="44" viewBox="0 0 56 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_dd_601_44919)">
      <rect width="44" height="44" rx="22" fill="#007FF2" shapeRendering="crispEdges" />
      <path
        d="M22 25.5C24.21 25.5 26 23.71 26 21.5V16C26 13.79 24.21 12 22 12C19.79 12 18 13.79 18 16V21.5C18 23.71 19.79 25.5 22 25.5Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3496 19.6504V21.3504C14.3496 25.5704 17.7796 29.0004 21.9996 29.0004C26.2196 29.0004 29.6496 25.5704 29.6496 21.3504V19.6504"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.6094 16.4301C21.5094 16.1001 22.4894 16.1001 23.3894 16.4301"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.1992 18.5503C21.7292 18.4103 22.2792 18.4103 22.8092 18.5503"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 29V32"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <filter
        id="filter0_dd_601_44919"
        x="-12"
        y="-2"
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
        <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect1_dropShadow_601_44919" />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="3" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0.333333 0 0 0 0 1 0 0 0 0.5 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_601_44919" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology radius="3" operator="erode" in="SourceAlpha" result="effect2_dropShadow_601_44919" />
        <feOffset dy="10" />
        <feGaussianBlur stdDeviation="7.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend mode="normal" in2="effect1_dropShadow_601_44919" result="effect2_dropShadow_601_44919" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_601_44919" result="shape" />
      </filter>
    </defs>
  </svg>
);

export { Mic1, Mic2 };
