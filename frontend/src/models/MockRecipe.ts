import type { Recipe } from "./Recipe";
import type { Ingredient } from "./Ingredient";

const now = new Date().toISOString();

const mk = (n: number, title: string, slug: string, categoryId: string, difficulty: Recipe["difficulty"], prep = 20, img = `/images/${slug}.jpg`): Recipe => ({
  id: `r-${String(n).padStart(3, "0")}`,
  title,
  slug,
  story: `${title} — simple mock recipe for testing.`,
  ingredients: [
    { name: "Ingredient A", quantity: "1", unit: "unit" } as Ingredient,
    { name: "Ingredient B", quantity: "2", unit: "units" } as Ingredient,
  ],
  steps: ["Mix ingredients.", "Cook or assemble.", "Serve."],
  prepTimeMinutes: prep,
  difficulty,
  categoryId,
  imageUrl: img,
  createdBy: "MockUser",
  createdAt: now,
  updatedAt: now,
});

export const mockRecipes: Recipe[] = [
  mk(1, "Classic Pancakes", "classic-pancakes", "c-breakfast", "Easy", 15),
  mk(2, "Avocado Toast", "avocado-toast", "c-breakfast", "Easy", 10),
  mk(3, "Chicken Caesar Salad", "chicken-caesar-salad", "c-lunch", "Medium", 20),
  mk(4, "BLT Sandwich", "blt-sandwich", "c-lunch", "Easy", 12),
  mk(5, "Spaghetti Bolognese", "spaghetti-bolognese", "c-dinner", "Medium", 40),
  mk(6, "Pan-Seared Salmon", "pan-seared-salmon", "c-dinner", "Hard", 30),
  mk(7, "Chocolate Brownies", "chocolate-brownies", "c-dessert", "Medium", 45),
  mk(8, "Lemon Tart", "lemon-tart", "c-dessert", "Hard", 60),
  mk(9, "Roasted Chickpeas", "roasted-chickpeas", "c-snacks", "Easy", 25),
  mk(10, "Trail Mix", "trail-mix", "c-snacks", "Easy", 5),
  mk(11, "Strawberry Smoothie", "strawberry-smoothie", "c-drinks", "Easy", 5),
  mk(12, "Iced Coffee", "iced-coffee", "c-drinks", "Easy", 5),
];

export default mockRecipes;