import type { ReactNode } from 'react';

interface LineIconProps {
  size?: number;
  strokeWidth?: number;
  children: ReactNode;
}

function LineIcon({ size = 20, strokeWidth = 1.6, children }: LineIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <LineIcon size={18}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </LineIcon>
  );
}

export function TikTokIcon() {
  return (
    <LineIcon size={18}>
      <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" />
    </LineIcon>
  );
}

export function YouTubeIcon() {
  return (
    <LineIcon size={18}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </LineIcon>
  );
}

export function FacebookIcon() {
  return (
    <LineIcon size={18}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </LineIcon>
  );
}

export function TruckIcon() {
  return (
    <LineIcon size={40} strokeWidth={1.2}>
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </LineIcon>
  );
}

export function ShieldLockIcon() {
  return (
    <LineIcon size={40} strokeWidth={1.2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <rect x="9" y="10.5" width="6" height="5" rx="1" />
      <path d="M10 10.5V9a2 2 0 0 1 4 0v1.5" />
    </LineIcon>
  );
}

export function HeadsetIcon() {
  return (
    <LineIcon size={40} strokeWidth={1.2}>
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </LineIcon>
  );
}

interface FilledIconProps {
  size?: number;
}

export function MoonIcon({ size = 36 }: FilledIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function SparkleIcon({ size = 16 }: FilledIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2c0 6 4 10 10 10-6 0-10 4-10 10 0-6-4-10-10-10 6 0 10-4 10-10z" />
    </svg>
  );
}

export function BatIcon() {
  return (
    <svg
      viewBox="0 0 64 28"
      width="100%"
      height="100%"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M32 6c-1.5 0-2.5 1.5-3 3-3-2-8-4-14-3C10 7 5 9 1 14c4-1 7-1 9 1 2-2 5-2 7 0 2-2 5-1 7 1 2 3 5 6 8 7 3-1 6-4 8-7 2-2 5-3 7-1 2-2 5-2 7 0 2-2 5-2 9-1-4-5-9-7-14-8-6-1-11 1-14 3-.5-1.5-1.5-3-3-3z" />
    </svg>
  );
}

export function BranchIcon() {
  return (
    <svg
      viewBox="0 0 200 260"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 250C30 190 45 140 38 90S60 25 105 0" strokeWidth="5" />
      <path d="M40 120C75 105 110 100 150 62" strokeWidth="3" />
      <path d="M36 80C15 62 22 38 0 20" strokeWidth="3" />
      <path d="M44 170C85 160 120 140 170 142" strokeWidth="3" />
      <path d="M62 45C90 55 120 45 155 20" strokeWidth="2" />
      <path d="M110 92C130 98 150 96 185 82" strokeWidth="1.5" />
      <path d="M150 62C165 50 178 52 195 40" strokeWidth="1.5" />
    </svg>
  );
}