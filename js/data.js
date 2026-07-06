const CAFE_CATEGORIES = [
  { id: "coffee", name: "Coffee" },
  { id: "non-coffee", name: "Non Coffee" },
  { id: "tea", name: "Tea" },
  { id: "dessert", name: "Dessert" },
];

const CAFE_MENUS = [
  {
    id: 1,
    categoryId: "coffee",
    name: "Americano",
    description: "Clean espresso with hot water.",
    price: 4500,
    isSignature: false,
    isAvailable: true,
  },
  {
    id: 2,
    categoryId: "coffee",
    name: "Cafe Latte",
    description: "Espresso with steamed milk.",
    price: 5200,
    isSignature: true,
    isAvailable: true,
  },
  {
    id: 3,
    categoryId: "non-coffee",
    name: "Matcha Latte",
    description: "Rich green tea latte with milk.",
    price: 5800,
    isSignature: true,
    isAvailable: true,
  },
  {
    id: 4,
    categoryId: "tea",
    name: "Earl Grey Tea",
    description: "Black tea with bergamot aroma.",
    price: 4800,
    isSignature: false,
    isAvailable: true,
  },
  {
    id: 5,
    categoryId: "dessert",
    name: "Basque Cheesecake",
    description: "Creamy cheesecake with a caramelized top.",
    price: 6800,
    isSignature: true,
    isAvailable: true,
  },
];

window.CafeData = {
  categories: CAFE_CATEGORIES,
  menus: CAFE_MENUS,
};
