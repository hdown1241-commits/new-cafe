const getDataAssetRoot = () => {
  const scriptPath = document.currentScript?.getAttribute("src") || "";
  if (scriptPath.startsWith("../../")) return "../../";
  if (scriptPath.startsWith("../")) return "../";
  return "./";
};

const DATA_ASSET_ROOT = getDataAssetRoot();

const getDataAssetUrl = (filename) =>
  new URL(`${DATA_ASSET_ROOT}assets/${filename}`, document.baseURI).href;

const CAFE_CATEGORIES = [
  { id: "coffee", name: "커피" },
  { id: "non-coffee", name: "논커피" },
  { id: "tea", name: "티" },
  { id: "dessert", name: "디저트" },
];

const CAFE_MENUS = [
  {
    id: 1,
    categoryId: "coffee",
    name: "아메리카노",
    description: "깔끔한 에스프레소에 뜨거운 물을 더한 커피",
    price: 4500,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5a/A_cup_of_Americano_in_Lano_Coffee_%28Palembang%2C_SS%29.jpg",
    isSignature: false,
    isAvailable: true,
  },
  {
    id: 2,
    categoryId: "coffee",
    name: "카페 라떼",
    description: "에스프레소에 부드러운 스팀 밀크를 더한 커피",
    price: 5200,
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Caffe_Latte_cup.jpg",
    isSignature: true,
    isAvailable: true,
  },
  {
    id: 3,
    categoryId: "non-coffee",
    name: "말차 라떼",
    description: "진한 말차와 우유가 어우러진 라떼",
    price: 5800,
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Matcha_green_tea_latte_art.jpg",
    isSignature: true,
    isAvailable: true,
  },
  {
    id: 4,
    categoryId: "tea",
    name: "얼그레이 티",
    description: "베르가못 향이 은은하게 감도는 홍차",
    price: 4800,
    image: "https://upload.wikimedia.org/wikipedia/commons/2/22/Cup_of_Earl_Gray.jpg",
    isSignature: false,
    isAvailable: true,
  },
  {
    id: 5,
    categoryId: "dessert",
    name: "바스크 치즈케이크",
    description: "표면을 그을려 진한 풍미를 더한 크리미한 치즈케이크",
    price: 6800,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/ee/Chestnut_Basque_Cheesecake_-_MOGUMOGU_2024-11-02.jpg",
    isSignature: true,
    isAvailable: true,
  },
  {
    id: 6,
    categoryId: "non-coffee",
    name: "Grapefruit Mango Coco",
    description: "Pink grapefruit, mango puree, and coconut cream blended for a bright seasonal drink.",
    price: 6500,
    image: getDataAssetUrl("seasonal-mango.png"),
    isSignature: true,
    isSeasonal: true,
    isAvailable: true,
  },
  {
    id: 7,
    categoryId: "tea",
    name: "Sea Salt Foam Black Tea",
    description: "Iced black tea finished with a soft sea-salt cream foam.",
    price: 5900,
    image: getDataAssetUrl("seasonal-tea.png"),
    isSignature: true,
    isSeasonal: true,
    isAvailable: true,
  },
  {
    id: 8,
    categoryId: "non-coffee",
    name: "Light Yuja Lemon Blended",
    description: "Yuja, lemon, and ice blended into a fresh golden summer cooler.",
    price: 6200,
    image: getDataAssetUrl("seasonal-yuja.png"),
    isSignature: true,
    isSeasonal: true,
    isAvailable: true,
  },
  {
    id: 9,
    categoryId: "non-coffee",
    name: "Watermelon Juice Blended",
    description: "Sweet watermelon blended with ice for a vivid pink seasonal refresher.",
    price: 6100,
    image: getDataAssetUrl("seasonal-watermelon.png"),
    isSignature: true,
    isSeasonal: true,
    isAvailable: true,
  },
];

// 이전(영문) 시드 데이터 - localStorage 마이그레이션 판별용
const LEGACY_EN_TEXT = {
  1: { name: "Americano", description: "Clean espresso with hot water." },
  2: { name: "Cafe Latte", description: "Espresso with steamed milk." },
  3: { name: "Matcha Latte", description: "Rich green tea latte with milk." },
  4: { name: "Earl Grey Tea", description: "Black tea with bergamot aroma." },
  5: {
    name: "Basque Cheesecake",
    description: "Creamy cheesecake with a caramelized top.",
  },
};

const MENUS_STORAGE_KEY = "new-cafe-menus";
const AMERICANO_RESTORE_KEY = "new-cafe-americano-restored-v1";

const isPlaceholderImage = (image) =>
  typeof image === "string" && image.startsWith("https://picsum.photos/");

const readMenus = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(MENUS_STORAGE_KEY));
    if (stored && stored.length) {
      // image 필드가 없거나 이전 임시 플레이스홀더 사진이면 실제 시드 사진으로 교체
      // 이름/설명이 이전 영문 시드 그대로면 한글 시드 텍스트로 교체
      const migrated = stored.map((menu) => {
        const seed = CAFE_MENUS.find((seedMenu) => seedMenu.id === menu.id);
        const legacy = LEGACY_EN_TEXT[menu.id];
        const next = { ...menu };

        if (menu.image === undefined || isPlaceholderImage(menu.image)) {
          next.image = seed ? seed.image : menu.image || "";
        }
        if (legacy && menu.name === legacy.name) {
          next.name = seed ? seed.name : menu.name;
        }
        if (legacy && menu.description === legacy.description) {
          next.description = seed ? seed.description : menu.description;
        }
        if (seed?.isSeasonal) {
          next.categoryId = seed.categoryId;
          next.name = seed.name;
          next.description = seed.description;
          next.price = seed.price;
          next.image = seed.image;
          next.isSignature = seed.isSignature;
          next.isSeasonal = true;
          next.isAvailable = seed.isAvailable;
        }

        return next;
      });
      const restoredAmericano = localStorage.getItem(AMERICANO_RESTORE_KEY) === "true";
      const hasAmericano = migrated.some((menu) => menu.id === 1);
      const missingSeasonalMenus = CAFE_MENUS.filter(
        (seed) => seed.isSeasonal && !migrated.some((menu) => menu.id === seed.id)
      );
      const nextMenus = !restoredAmericano && !hasAmericano
        ? [{ ...CAFE_MENUS[0] }, ...migrated]
        : migrated;
      const syncedMenus = [...nextMenus, ...missingSeasonalMenus.map((menu) => ({ ...menu }))];

      localStorage.setItem(AMERICANO_RESTORE_KEY, "true");
      localStorage.setItem(MENUS_STORAGE_KEY, JSON.stringify(syncedMenus));
      return syncedMenus;
    }
  } catch {
    // fall through to seed on malformed storage
  }
  const seeded = CAFE_MENUS.map((menu) => ({ ...menu }));
  localStorage.setItem(MENUS_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

const saveMenus = (menus) => {
  localStorage.setItem(MENUS_STORAGE_KEY, JSON.stringify(menus));
  return menus;
};

const nextMenuId = (menus) =>
  menus.reduce((max, menu) => Math.max(max, menu.id), 0) + 1;

const getCategoryById = (categoryId) =>
  CAFE_CATEGORIES.find((category) => category.id === categoryId);

const addMenu = (menuInput) => {
  const menus = readMenus();
  const menu = {
    id: nextMenuId(menus),
    categoryId: menuInput.categoryId,
    name: menuInput.name,
    description: menuInput.description || "",
    price: Number(menuInput.price) || 0,
    image: menuInput.image || "",
    isSignature: Boolean(menuInput.isSignature),
    isAvailable: menuInput.isAvailable !== false,
  };
  saveMenus([...menus, menu]);
  return menu;
};

const updateMenu = (menuId, updates) => {
  const menus = readMenus();
  const index = menus.findIndex((menu) => menu.id === Number(menuId));
  if (index === -1) return null;
  const updated = { ...menus[index], ...updates, id: menus[index].id };
  if (updates.price !== undefined) updated.price = Number(updates.price) || 0;
  menus[index] = updated;
  saveMenus(menus);
  return updated;
};

const deleteMenu = (menuId) =>
  saveMenus(readMenus().filter((menu) => menu.id !== Number(menuId)));

window.CafeData = {
  categories: CAFE_CATEGORIES,
  get menus() {
    return readMenus();
  },
  getCategoryById,
  addMenu,
  updateMenu,
  deleteMenu,
};
