import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Consnect — Construction Platform",
    short_name: "Consnect",
    description: "Rwanda's leading platform for construction companies, tenders, and business opportunities.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f59e0b",
    icons: [
      { src: "/logo/consnect.png", sizes: "192x192", type: "image/png" },
      { src: "/logo/consnect.png", sizes: "512x512", type: "image/png" },
    ],
    categories: ["business", "construction", "marketplace"],
    lang: "en",
    dir: "ltr",
    scope: "/",
  };
}
