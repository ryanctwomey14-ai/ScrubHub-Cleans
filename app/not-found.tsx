import Link from "next/link";
import { business } from "@/content/business";
import { DarkHero } from "@/components/sections/DarkHero";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <DarkHero
      eyebrow="404"
      title={
        <>
          This Page Missed a Spot. <em>We&rsquo;ll Make It Right.</em>
        </>
      }
      lede="The page you're looking for doesn't exist or has moved."
      photoBrief="Any bright, finished interior."
    >
      <Link href="/" className="btn btn-primary">
        Back to home <Icon name="arrow" size={16} className="btn-arrow" />
      </Link>
      <Link href="/contact" className="btn btn-ghost-light">
        Get My Price
      </Link>
      <a href={business.contact.phoneHref} className="font-bold hover:text-glint">
        {business.contact.phoneDisplay}
      </a>
    </DarkHero>
  );
}
