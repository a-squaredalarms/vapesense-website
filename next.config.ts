import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The live 3D scenes (src/scenes) build their geometry in setup code that must run once.
  // React's development double-mount runs it twice and leaves stale copies (e.g. a frozen
  // half-built blueprint), so StrictMode is off — matching the original animation project.
  reactStrictMode: false,
  // Built as plain static files for GitHub Pages (no server). `npm run build` writes them to /out.
  output: 'export',
  // GitHub Pages can't resize images on request, so images are served as they are.
  images: { unoptimized: true },
};

export default nextConfig;
