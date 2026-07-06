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

window.CafeUtils = {
  addToCart,
  clearCart,
  formatPrice,
  getCartCount,
  getCartTotal,
  getMenuById,
  getMenusByCategory,
  readCart,
  removeCartItem,
  updateCartItem,
};
