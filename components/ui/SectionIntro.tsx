export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 text-stone ${className}`}>
      <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
      {children}
    </p>
  );
}

/** Eyebrow + display heading. Pass <em> inside the title for the italic accent. */
export function SectionIntro({
  eyebrow,
  title,
  as: Tag = "h2",
  className = "",
  titleClassName = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <div data-reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <Tag
        data-reveal
        data-reveal-delay="0.08"
        className={`display mt-6 text-[clamp(2.375rem,4.6vw,4.25rem)] ${titleClassName}`}
      >
        {title}
      </Tag>
    </div>
  );
}
