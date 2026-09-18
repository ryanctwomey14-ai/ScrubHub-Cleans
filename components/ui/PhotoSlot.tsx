/**
 * A deliberate, on-brand stand-in for photography that hasn't been shot yet.
 * Swap for <Image> once the client supplies the photo described in `brief`.
 * The soft "window light" gradient keeps the page feeling finished meanwhile.
 */
export function PhotoSlot({
  brief,
  label = "Photo to shoot",
  tone = "warm",
  className = "",
  showBrief = true,
  briefClassName = "bottom-4 md:bottom-5",
}: {
  briefClassName?: string;
  brief: string;
  label?: string;
  tone?: "warm" | "cool" | "ink";
  className?: string;
  showBrief?: boolean;
}) {
  const tones = {
    warm: "from-[#efe8db] via-[#e6ddcd] to-[#d8cdb9]",
    cool: "from-[#e9edf1] via-[#dde3ea] to-[#c9d2dd]",
    ink: "from-[#23355c] via-[#1a2a4c] to-[#0f1d3a]",
  } as const;
  const onInk = tone === "ink";

  return (
    <div
      role="img"
      aria-label={`Placeholder image. ${brief}`}
      className={`relative isolate overflow-hidden bg-gradient-to-br ${tones[tone]} ${className}`}
    >
      {/* window-light wash */}
      <div
        aria-hidden="true"
        className="absolute -left-1/4 -top-1/3 h-[140%] w-[80%] rotate-[18deg] opacity-70 blur-2xl"
        style={{
          background: onInk
            ? "linear-gradient(90deg, transparent, rgba(63,216,242,0.10), transparent)"
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)",
        }}
      />
      {/* mullion shadows, like light through a window frame */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(108deg, ${onInk ? "#fff" : "#0f1d3a"} 0 1px, transparent 1px 22%)`,
        }}
      />
      {showBrief && (
        <div className={`absolute inset-x-4 md:inset-x-5 ${briefClassName}`}>
          <div
            className={`max-w-sm rounded-xl px-4 py-3 backdrop-blur-md ${
              onInk ? "bg-white/8 text-porcelain/85" : "bg-white/55 text-ink/75"
            }`}
          >
            <p className="eyebrow mb-1.5 !text-[0.625rem] opacity-80">{label}</p>
            <p className="text-[0.8125rem] leading-snug">{brief}</p>
          </div>
        </div>
      )}
    </div>
  );
}
