export type PaginationItem = number | "ellipsis";

/** Build page numbers with ellipses (e.g. 1 2 3 … 9 10 11). */
export function getPaginationItems(
  currentPage: number,
  totalPages: number
): PaginationItem[] {
  if (totalPages <= 0) return [];
  if (totalPages === 1) return [1];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(2);
  pages.add(3);
  pages.add(totalPages);
  pages.add(totalPages - 1);
  pages.add(totalPages - 2);
  pages.add(currentPage);
  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const items: PaginationItem[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const value = sorted[i]!;
    if (i > 0 && value - sorted[i - 1]! > 1) {
      items.push("ellipsis");
    }
    items.push(value);
  }
  return items;
}
