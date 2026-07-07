const CART_STORAGE_KEY = "new-cafe-cart";

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

// 데모용 관리자 게이트 - 백엔드/로그인 없이 클라이언트에서만 PIN을 확인하므로
// 실제 접근 제어가 아니라 우발적인 진입만 막는 용도입니다.
const ADMIN_PASSCODE = "admin1234";
const ADMIN_SESSION_KEY = "new-cafe-admin-authed";

const isAdminAuthenticated = () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";

const requireAdminAccess = () => {
  if (isAdminAuthenticated()) return true;

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
  getMenuById,
  getMenusByCategory,
  isAdminAuthenticated,
  readCart,
  removeCartItem,
  requireAdminAccess,
  updateCartItem,
};
