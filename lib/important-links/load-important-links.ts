import "server-only";

import { readFile } from "fs/promises";
import path from "path";

export type FacebookLinkItem = {
  name: string;
  link: string;
};

export type ImportantLinksData = {
  groups: FacebookLinkItem[];
  pages: FacebookLinkItem[];
};

function isLinkItem(value: unknown): value is FacebookLinkItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.name === "string" && typeof item.link === "string";
}

function parseImportantLinks(raw: unknown): ImportantLinksData {
  if (!raw || typeof raw !== "object") {
    throw new Error("important-links.json must be an object");
  }
  const data = raw as Record<string, unknown>;
  const groups = data.groups;
  const pages = data.pages;
  if (!Array.isArray(groups) || !Array.isArray(pages)) {
    throw new Error("important-links.json requires groups and pages arrays");
  }
  if (!groups.every(isLinkItem) || !pages.every(isLinkItem)) {
    throw new Error("Each entry must have name and link strings");
  }
  return { groups, pages };
}

export async function loadImportantLinks(): Promise<ImportantLinksData> {
  const filePath = path.join(process.cwd(), "public", "important-links.json");
  const text = await readFile(filePath, "utf8");
  return parseImportantLinks(JSON.parse(text));
}
