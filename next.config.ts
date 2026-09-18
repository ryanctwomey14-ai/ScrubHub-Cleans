import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 only allows listed qualities; 90 is used for the hero photo.
    qualities: [75, 90],
  },
  // The chat route reads the knowledge base from disk at runtime.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/chatbot-knowledge.md"],
  },
};

export default nextConfig;
