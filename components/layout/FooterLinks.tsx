"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerNav, landingPaths } from "./nav";

/** The small link row under the footer. Hidden on ad landing pages. */
export function FooterLinks() {
  const pathname = usePathname();
  if (landingPaths.includes(pathname)) return null;

  return (
    <nav aria-label="Footer" className="-mx-2 flex flex-wrap md:mx-0 md:gap-x-4">
      {footerNav.map((l) => (
        <Link key={l.href} href={l.href} className="px-2 py-3 hover:text-porcelain md:px-0 md:py-1">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
