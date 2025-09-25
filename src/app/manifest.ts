import type { MetadataRoute } from "next";
import "./globals.css";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cuidarte",
    short_name: "Cuidarte",
    description: "Cuidarte Progressive Web App built with Next.js",
    start_url: "",
    scope: "",
    display: "standalone",
    background_color: "#dbe9f3",
    theme_color: "#053b5e",
    icons: [
      {
        src: "/icon1.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
