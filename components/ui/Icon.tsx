import type { SVGProps } from "react";

type IconName =
  | "arrow"
  | "arrow-up-right"
  | "phone"
  | "message"
  | "mail"
  | "clock"
  | "star"
  | "check"
  | "plus"
  | "close"
  | "menu"
  | "pin"
  | "send"
  | "shield"
  | "repeat"
  | "layers"
  | "key"
  | "bed"
  | "building"
  | "sliders"
  | "badge";

const paths: Record<IconName, React.ReactNode> = {
  arrow: <path d="M4 12h15m-5.5-6L19.5 12l-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8.5 7H17v8.5" />,
  phone: (
    <path d="M5.2 3.5h3.1l1.6 4.1-2.1 1.3a11 11 0 0 0 5.3 5.3l1.3-2.1 4.1 1.6v3.1a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.2 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  message: (
    <path d="M4 5.5h16v10.5H9.5L5.5 19.5V16H4z M8 9.5h8M8 12.5h5" />
  ),
  mail: <path d="M3.5 6h17v12h-17zM4 6.5l8 6.5 8-6.5" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2" />,
  star: (
    <path
      d="m12 3.2 2.6 5.5 6 .8-4.4 4.1 1.1 5.9L12 16.6l-5.3 2.9 1.1-5.9-4.4-4.1 6-.8z"
      fill="currentColor"
      stroke="none"
    />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 8h16M4 16h16" />,
  pin: (
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
  ),
  send: <path d="M4.5 12h14M13 6l6 6-6 6" />,
  shield: <path d="M12 3.5 19 6v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6zm-3.2 8.8 2.3 2.3 4.2-4.6" />,
  repeat: <path d="M17 3.5 20 6.5l-3 3M4 11.5v-1a4 4 0 0 1 4-4h12M7 20.5l-3-3 3-3M20 12.5v1a4 4 0 0 1-4 4H4" />,
  layers: <path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8zM3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5" />,
  key: <path d="M14.5 9.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-1.3 3.2 7.3 7.3m-3-3 2-2m-4 0 2-2" />,
  bed: <path d="M3 18.5v-11m0 7h18v4m0-4v-3a3 3 0 0 0-3-3h-7v6M7 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />,
  building: <path d="M4.5 20.5v-15l8-2.5v17.5m0 0h7v-11l-7-2M8 8.5h1.5M8 12h1.5M8 15.5h1.5M15.5 12.5H17M15.5 16H17M3 20.5h18" />,
  sliders: <path d="M4 7h9m4 0h3M4 17h3m4 0h9M15 4.5v5M9 14.5v5" />,
  badge: <path d="M12 3.5l2.2 1.6 2.7-.1.8 2.6 2.2 1.6-.9 2.6.9 2.6-2.2 1.6-.8 2.6-2.7-.1L12 20.5l-2.2-1.6-2.7.1-.8-2.6-2.2-1.6.9-2.6-.9-2.6 2.2-1.6.8-2.6 2.7.1zm-3 8.7 2 2 4-4.2" />,
};

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.6,
  ...props
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

export function Stars({ className = "", size = 14 }: { className?: string; size?: number }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={size} />
      ))}
    </span>
  );
}
