export function isCollectionEmpty(visibleCount: number): boolean {
  return visibleCount === 0;
}

export function isCollectionItemVisible(label: string, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return label.toLowerCase().includes(normalizedQuery);
}
