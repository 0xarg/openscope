import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://openscope.anuragx.dev",
      lastModified: new Date(),
    },
  ];
}
