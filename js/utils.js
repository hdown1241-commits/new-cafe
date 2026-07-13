const CART_STORAGE_KEY = "new-cafe-cart";
const AUTH_STORAGE_KEY = "new-cafe-auth-user";

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

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  return cart;
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

const getMenuById = (menuId) =>
  window.CafeData?.menus.find((menu) => menu.id === Number(menuId));

const getMenusByCategory = (categoryId) =>
  window.CafeData?.menus.filter((menu) => menu.categoryId === categoryId) || [];

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
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
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
};

const logout = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
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
    adminLink.textContent = "Admin";
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
    authAction.textContent = `${user.name} Logout`;
    authAction.addEventListener("click", () => {
      logout();
      window.location.href = `${APP_ROOT}index.html`;
    });
  } else {
    authAction.href = `${APP_ROOT}auth/login.html?returnTo=${getReturnTo()}`;
    authAction.textContent = "Login";
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
  updateCartItem,
};

renderAuthNav();
