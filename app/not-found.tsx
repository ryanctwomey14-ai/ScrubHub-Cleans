import Link from "next/link";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80vh] flex-col items-start justify-center pb-24 pt-40">
      <p className="eyebrow text-stone">404</p>
      <h1 className="display mt-6 max-w-[14ch] text-[clamp(3rem,7vw,6rem)] leading-[0.98]">
        This page missed a spot. <em>We&rsquo;ll make it right.</em>
      </h1>
      <p className="lede mt-8 max-w-lg text-stone">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved. Let&rsquo;s get you back somewhere useful.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Back to home <Icon name="arrow" size={16} className="btn-arrow" />
        </Link>
        <a href={business.contact.phoneHref} className="btn btn-ghost">
          <Icon name="phone" size={16} /> {business.contact.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
