import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The chat route reads the knowledge base from disk at runtime.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/chatbot-knowledge.md"],
  },
};

export default nextConfig;
