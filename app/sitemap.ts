import type { MetadataRoute } from "next";
import { SITE } from "./site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
