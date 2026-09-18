import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { business, cityLabel } from "@/content/business";

export const alt = `${business.name}: premium cleaning in ${cityLabel}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData = await readFile(join(process.cwd(), "public", "brand", "logo-on-dark.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 85% 10%, #1d4a73 0%, #0f1d3a 55%)",
          color: "#f7f5f0",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} height={110} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: 900 }}>
            Tailored cleaning, made right. Always.
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#a9b6cc" }}>
            {`Rated ${business.rating.value} stars from ${business.rating.count} reviews · ${cityLabel} · ${business.contact.phoneDisplay}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
