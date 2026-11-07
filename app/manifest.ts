import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "श्रमदान · Shramdaan",
    short_name: "श्रमदान",
    description: "Nepali fan-made Shramdaan game",
    start_url: "/",
    display: "standalone",
    background_color: "#1f2a33",
    theme_color: "#1f2a33",
    lang: "ne",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
