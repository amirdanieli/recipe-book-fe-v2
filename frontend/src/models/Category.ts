export interface Category {
  id: string;        // internal id (used on recipes)
  name: string;      // human-friendly name (used in URLs/display)
  slug: string;      // slug (URL-safe)
  count?: number;    // number of recipes in this category
}
