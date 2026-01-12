import { siteConfig } from "@/config/site";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}年${month}月${day}日`;
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return `${siteConfig.imagesBaseUrl}${siteConfig.defaultImage}`;
  if (imagePath.startsWith("http")) return imagePath;
  return `${siteConfig.imagesBaseUrl}/${imagePath}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
