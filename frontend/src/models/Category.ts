export interface Category {
  /** Internal id (referenced by recipes). */
  id: string;
  /** Human-friendly display name. */
  name: string;
  /** URL-safe identifier used in routes. */
  slug: string;
  /** Number of recipes in this category. */
  count?: number;
}
