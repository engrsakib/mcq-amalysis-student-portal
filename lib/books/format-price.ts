export function formatBookPrice(price: number): string {
  if (!Number.isFinite(price)) return "৳—";
  const rounded = Math.round(price);
  return `৳${rounded.toLocaleString("en-BD")}`;
}

export function formatSoldPlatform(platform: string): string {
  const trimmed = platform.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
