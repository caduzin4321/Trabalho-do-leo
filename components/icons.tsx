import type { ReactNode } from "react";

type P = { className?: string };

function Svg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-5 w-5"}
    >
      {children}
    </svg>
  );
}

export const IconHome = (p: P) => (
  <Svg {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></Svg>
);
export const IconSala = (p: P) => (
  <Svg {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8" /><path d="M12 16v4" /></Svg>
);
export const IconClipboard = (p: P) => (
  <Svg {...p}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9z" /><path d="M9 12h6M9 16h6" /></Svg>
);
export const IconTag = (p: P) => (
  <Svg {...p}><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="7.5" cy="8.5" r="1.2" /></Svg>
);
export const IconShield = (p: P) => (
  <Svg {...p}><path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></Svg>
);
export const IconUsers = (p: P) => (
  <Svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" /><path d="M16 5a3.5 3.5 0 010 6" /><path d="M18 14c2 .7 3.5 2.6 3.5 5" /></Svg>
);
export const IconUserPlus = (p: P) => (
  <Svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" /><path d="M19 8v6M16 11h6" /></Svg>
);
export const IconLogout = (p: P) => (
  <Svg {...p}><path d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4" /><path d="M16 8l4 4-4 4" /><path d="M20 12H9" /></Svg>
);
export const IconPlus = (p: P) => (
  <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
);
export const IconEye = (p: P) => (
  <Svg {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Svg>
);
export const IconPencil = (p: P) => (
  <Svg {...p}><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="M13.5 6.5l4 4" /></Svg>
);
export const IconTrash = (p: P) => (
  <Svg {...p}>
    <path d="M3 6h18" /><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
  </Svg>
);
export const IconBolt = (p: P) => (
  <Svg {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></Svg>
);
export const IconArrow = (p: P) => (
  <Svg {...p}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></Svg>
);
export const IconPulse = (p: P) => (
  <Svg {...p}><path d="M3 12h4l2-6 4 12 2-6h6" /></Svg>
);
export const IconCheck = (p: P) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></Svg>
);
export const IconAlert = (p: P) => (
  <Svg {...p}><path d="M12 3l10 18H2L12 3z" /><path d="M12 10v5" /><path d="M12 18h.01" /></Svg>
);
export const IconPlug = (p: P) => (
  <Svg {...p}><path d="M9 3v5M15 3v5" /><path d="M6 8h12v4a6 6 0 01-12 0V8z" /><path d="M12 18v3" /></Svg>
);
export const IconServer = (p: P) => (
  <Svg {...p}><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 16.5h.01" /></Svg>
);
export const IconPort = (p: P) => (
  <Svg {...p}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M8 10v4M12 10v4M16 10v4" /></Svg>
);
export const IconNetwork = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" />
    <path d="M11 7.3L6 15.8M13 7.3l5 8.5M7.5 18h9" />
  </Svg>
);
export const IconMenu = (p: P) => (
  <Svg {...p}><path d="M4 6h16M4 12h16M4 18h16" /></Svg>
);