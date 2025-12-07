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
  mk(3, "Veggie Omelette", "veggie-omelette", "c-breakfast", "Easy", 12),
  mk(4, "Chicken Caesar Salad", "chicken-caesar-salad", "c-lunch", "Medium", 20),
  mk(5, "BLT Sandwich", "blt-sandwich", "c-lunch", "Easy", 12),
  mk(6, "Greek Salad", "greek-salad", "c-lunch", "Easy", 15),
  mk(7, "Spaghetti Bolognese", "spaghetti-bolognese", "c-dinner", "Medium", 40),
  mk(8, "Pan-Seared Salmon", "pan-seared-salmon", "c-dinner", "Hard", 30),
  mk(9, "Beef Tacos", "beef-tacos", "c-dinner", "Medium", 25),
  mk(10, "Lamb Chops", "lamb-chops", "c-dinner", "Hard", 45),
  mk(11, "Chocolate Brownies", "chocolate-brownies", "c-dessert", "Medium", 45),
  mk(12, "Lemon Tart", "lemon-tart", "c-dessert", "Hard", 60),
  mk(13, "Apple Pie", "apple-pie", "c-dessert", "Medium", 70),
  mk(14, "Banana Bread", "banana-bread", "c-dessert", "Easy", 65),
  mk(15, "Roasted Chickpeas", "roasted-chickpeas", "c-snacks", "Easy", 25),
  mk(16, "Trail Mix", "trail-mix", "c-snacks", "Easy", 5),
  mk(17, "Nacho Platter", "nacho-platter", "c-snacks", "Easy", 20),
  mk(18, "Strawberry Smoothie", "strawberry-smoothie", "c-drinks", "Easy", 5),
  mk(19, "Iced Coffee", "iced-coffee", "c-drinks", "Easy", 5),
  mk(20, "Mango Lassi", "mango-lassi", "c-drinks", "Easy", 10),
];

export default mockRecipes;