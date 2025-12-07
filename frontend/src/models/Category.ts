export interface Category {
  id: string;        // internal id (used on recipes)
  name: string;      // human-friendly name (used in URLs/display)
  slug?: string;     // optional slug (URL-safe) — if omitted, can derive from name
  count?: number;    // number of recipes in this category (computed by backend/frontend)
}

export const categories: Category[] = [
  { id: "c-breakfast", name: "Breakfast", slug: "breakfast", count: 25 },
  { id: "c-lunch", name: "Lunch", slug: "lunch", count: 12 },
  { id: "c-dinner", name: "Dinner", slug: "dinner", count: 3 },
  { id: "c-dessert", name: "Dessert", slug: "dessert", count: 8 },
  { id: "c-snacks", name: "Snacks", slug: "snacks", count: 13 },
  { id: "c-drinks", name: "Drinks", slug: "drinks", count: 10 },
];

export default categories;