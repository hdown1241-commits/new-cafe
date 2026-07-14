const CAFE_CART_STORAGE_KEY = "new-cafe-cart";
const CAFE_LEGACY_CART_STORAGE_KEYS = ["cart", "basket", "new-cafe-basket"];
const CAFE_AUTH_STORAGE_KEY = "new-cafe-auth-user";
const CAFE_ORDERS_STORAGE_KEY = "new-cafe-orders";

const getAppRoot = () => {
  const scriptPath = document.currentScript?.getAttribute("src") || "";
  if (scriptPath.startsWith("../../")) return "../../";
  if (scriptPath.startsWith("../")) return "../";
  return "./";
};

const APP_ROOT = getAppRoot();

const formatPrice = (price) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(price);

const normalizeCartItem = (item) => {
  if (!item || typeof item !== "object") return null;

  const menu = item.menu || {};
  const id = Number(item.id ?? item.menuId ?? menu.id);
  const quantity = Number(item.quantity ?? item.count ?? item.qty ?? 1);
  const price = Number(item.price ?? menu.price);
  const name = item.name ?? menu.name;

  if (!Number.isFinite(id) || !name || !Number.isFinite(price)) return null;

  return {
    id,
    name,
    price,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
  };
};

const readStoredCart = (key) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    const items = Array.isArray(stored) ? stored : stored?.items;
    if (!Array.isArray(items)) return [];

    return items.map(normalizeCartItem).filter(Boolean);
  } catch {
    return [];
  }
};

const readCart = () => {
  const cart = readStoredCart(CAFE_CART_STORAGE_KEY);
  if (cart.length > 0) return cart;

  const legacyCart = CAFE_LEGACY_CART_STORAGE_KEYS.flatMap(readStoredCart);
  if (legacyCart.length > 0) {
    localStorage.setItem(CAFE_CART_STORAGE_KEY, JSON.stringify(legacyCart));
  }

  return legacyCart;
};

const updateCartBadges = () => {
  document.querySelectorAll("#cartCount").forEach((badge) => {
    badge.textContent = getCartCount();
  });
  updateMyPageActivity();
};

const saveCart = (cart) => {
  const normalizedCart = cart.map(normalizeCartItem).filter(Boolean);
  localStorage.setItem(CAFE_CART_STORAGE_KEY, JSON.stringify(normalizedCart));
  updateCartBadges();
  window.dispatchEvent(new CustomEvent("cafe:cart-updated"));
  return normalizedCart;
};

const getCartCount = () =>
  readCart().reduce((total, item) => total + item.quantity, 0);

const addToCart = (menu, quantity = 1) => {
  const cart = readCart();
  const item = cart.find((cartItem) => cartItem.id === menu.id);

  if (item) {
    item.quantity += quantity;
  } else {
    cart.push({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      quantity,
    });
  }

  return saveCart(cart);
};

const updateCartItem = (menuId, quantity) => {
  const cart = readCart()
    .map((item) => (item.id === menuId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  return saveCart(cart);
};

const removeCartItem = (menuId) =>
  saveCart(readCart().filter((item) => item.id !== menuId));

const clearCart = () => saveCart([]);

const getCartTotal = () =>
  readCart().reduce((total, item) => total + item.price * item.quantity, 0);

const readOrderCount = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CAFE_ORDERS_STORAGE_KEY));
    return Array.isArray(stored) ? stored.length : 0;
  } catch {
    return 0;
  }
};

const setUtilityText = (element, text) => {
  if (element) element.textContent = text;
};

const getUtilityQuickCard = (href) => document.querySelector(`.quick-card[href="${href}"]`);

const getUtilityQuickCountElement = (card, id) => {
  if (!card) return null;

  let countElement = card.querySelector(`#${id}`);
  if (!countElement) {
    countElement = document.createElement("em");
    countElement.id = id;
    card.querySelector("strong")?.insertAdjacentElement("afterend", countElement);
  }

  return countElement;
};

const getUtilityQuickTextElement = (card) => {
  if (!card) return null;

  let textElement = card.querySelector("p");
  if (!textElement) {
    textElement = document.createElement("p");
    card.appendChild(textElement);
  }

  return textElement;
};

const updateMyPageActivity = () => {
  const cartItemCount = getCartCount();
  const orderCount = readOrderCount();
  const availableMenuCount =
    window.CafeData?.menus.filter((menu) => menu.isAvailable).length || 0;

  setUtilityText(document.querySelector("#basketCount"), cartItemCount);
  setUtilityText(document.querySelector("#basketTotal"), formatPrice(getCartTotal()));
  setUtilityText(document.querySelector("#orderCount"), orderCount);

  const menuCard = getUtilityQuickCard("../menus/list.html");
  const basketCard = getUtilityQuickCard("../basket/list.html");
  const orderCard = getUtilityQuickCard("../orders/list.html");

  setUtilityText(getUtilityQuickCountElement(menuCard, "quickMenuCount"), `${availableMenuCount}개`);
  setUtilityText(getUtilityQuickCountElement(basketCard, "quickBasketCount"), `${cartItemCount}개`);
  setUtilityText(getUtilityQuickCountElement(orderCard, "quickOrderCount"), `${orderCount}건`);
  setUtilityText(getUtilityQuickTextElement(menuCard), `판매 중인 메뉴 ${availableMenuCount}개를 둘러보세요.`);
  setUtilityText(
    getUtilityQuickTextElement(basketCard),
    cartItemCount > 0
      ? `담긴 메뉴 ${cartItemCount}개를 확인하고 수량을 조절하세요.`
      : "담은 메뉴가 없습니다. 원하는 음료를 담아보세요."
  );
  setUtilityText(
    getUtilityQuickTextElement(orderCard),
    orderCount > 0 ? `전체 주문 ${orderCount}건과 픽업 상태를 확인하세요.` : "아직 주문 내역이 없습니다."
  );
};

const getMenuById = (menuId) =>
  window.CafeData?.menus.find((menu) => menu.id === Number(menuId));

const getMenusByCategory = (categoryId) =>
  window.CafeData?.menus.filter((menu) => menu.categoryId === categoryId) || [];

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(CAFE_AUTH_STORAGE_KEY));
  } catch {
    return null;
  }
};

const isLoggedIn = () => Boolean(getCurrentUser()?.email);

const login = ({ name, email }) => {
  const user = {
    name: name || "\uc784\uc7ac\ud604",
    email: email || "limjh@example.com",
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(CAFE_AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
};

const logout = () => {
  localStorage.removeItem(CAFE_AUTH_STORAGE_KEY);
};

const getReturnTo = () => {
  const current = `${window.location.pathname}${window.location.search}`;
  return encodeURIComponent(current);
};

const requireAuth = () => {
  if (isLoggedIn()) return true;
  window.location.href = `${APP_ROOT}auth/login.html?returnTo=${getReturnTo()}`;
  return false;
};

const renderAuthNav = () => {
  const nav = document.querySelector(".header-nav");
  if (!nav || nav.dataset.authReady === "true") return;

  nav.dataset.authReady = "true";
  let adminLink = nav.querySelector("#adminLink");

  if (!adminLink && !window.location.pathname.includes("/admin/")) {
    adminLink = document.createElement("a");
    adminLink.href = `${APP_ROOT}admin/menus/list.html`;
    adminLink.id = "adminLink";
    adminLink.className = "admin-link";
    adminLink.textContent = "관리자";
    nav.appendChild(adminLink);
  }

  if (adminLink && !adminLink.dataset.adminReady) {
    adminLink.dataset.adminReady = "true";
    adminLink.addEventListener("click", (event) => {
      event.preventDefault();
      if (requireAdminAccess({ forcePrompt: true })) {
        window.location.href = adminLink.getAttribute("href");
      }
    });
  }

  const authAction = document.createElement(isLoggedIn() ? "button" : "a");
  authAction.className = "auth-link";

  if (isLoggedIn()) {
    const user = getCurrentUser();
    authAction.type = "button";
    authAction.textContent = `${user.name} 로그아웃`;
    authAction.addEventListener("click", () => {
      logout();
      window.location.href = `${APP_ROOT}index.html`;
    });
  } else {
    authAction.href = `${APP_ROOT}auth/login.html?returnTo=${getReturnTo()}`;
    authAction.textContent = "로그인";
  }

  nav.appendChild(authAction);
};

// 데모용 관리자 게이트 - 백엔드/로그인 없이 클라이언트에서만 PIN을 확인하므로
// 실제 접근 제어가 아니라 우발적인 진입만 막는 용도입니다.
const ADMIN_PASSCODE = "admin1234";
const ADMIN_SESSION_KEY = "new-cafe-admin-authed";

const isAdminAuthenticated = () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";

const requireAdminAccess = (options = {}) => {
  const { forcePrompt = false } = options;
  if (!forcePrompt && isAdminAuthenticated()) return true;

  const passcode = prompt("관리자 PIN을 입력하세요.");
  if (passcode === null) return false;

  if (passcode === ADMIN_PASSCODE) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    return true;
  }

  alert("PIN이 올바르지 않습니다.");
  return false;
};

window.CafeUtils = {
  addToCart,
  clearCart,
  formatPrice,
  getCartCount,
  getCartTotal,
  getCurrentUser,
  getMenuById,
  getMenusByCategory,
  isAdminAuthenticated,
  isLoggedIn,
  login,
  logout,
  readCart,
  removeCartItem,
  renderAuthNav,
  requireAuth,
  requireAdminAccess,
  updateCartBadges,
  updateMyPageActivity,
  updateCartItem,
};

window.addEventListener("pageshow", updateCartBadges);
window.addEventListener("focus", updateCartBadges);
window.addEventListener("storage", (event) => {
  if ([CAFE_CART_STORAGE_KEY, CAFE_ORDERS_STORAGE_KEY].includes(event.key)) {
    updateCartBadges();
  }
});

renderAuthNav();
updateCartBadges();
