"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerNav, landingPaths } from "./nav";

/** The small link row under the footer. Hidden on ad landing pages. */
export function FooterLinks() {
  const pathname = usePathname();
  if (landingPaths.includes(pathname)) return null;

  return (
    <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
      {footerNav.map((l) => (
        <Link key={l.href} href={l.href} className="hover:text-porcelain">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
