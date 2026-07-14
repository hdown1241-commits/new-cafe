window.CafeUtils.requireAuth();

const ORDERS_STORAGE_KEY = "new-cafe-orders";

const basketItems = document.querySelector("#basketItems");
const basketLayout = document.querySelector(".basket-layout");
const summaryCount = document.querySelector("#summaryCount");
const summaryTotal = document.querySelector("#summaryTotal");
const clearButton = document.querySelector("#clearButton");
const checkoutButton = document.querySelector("#checkoutButton");
const emptyMessage = document.querySelector("#emptyMessage");
const cartCount = document.querySelector("#cartCount");

const updateCartCount = () => {
  cartCount.textContent = window.CafeUtils.getCartCount();
};

const setQuantity = (menuId, quantity) => {
  const value = Math.min(Math.max(Number(quantity) || 1, 1), 20);
  window.CafeUtils.updateCartItem(menuId, value);
  renderBasket();
};

const renderBasket = () => {
  const cart = window.CafeUtils.readCart();

  basketLayout.hidden = cart.length === 0;
  emptyMessage.hidden = cart.length > 0;

  basketItems.innerHTML = cart
    .map(
      (item) => `
        <article class="basket-item" data-id="${item.id}">
          <div class="item-info">
            <h3>${item.name}</h3>
            <p class="unit-price">개당 ${window.CafeUtils.formatPrice(item.price)}</p>
          </div>
          <div class="quantity-input">
            <button type="button" class="decrease-button" aria-label="수량 줄이기">-</button>
            <input type="number" class="quantity-field" value="${item.quantity}" min="1" max="20" />
            <button type="button" class="increase-button" aria-label="수량 늘리기">+</button>
          </div>
          <p class="line-total">${window.CafeUtils.formatPrice(item.price * item.quantity)}</p>
          <button type="button" class="remove-button" aria-label="${item.name} 삭제">삭제</button>
        </article>
      `
    )
    .join("");

  summaryCount.textContent = window.CafeUtils.getCartCount();
  summaryTotal.textContent = window.CafeUtils.formatPrice(window.CafeUtils.getCartTotal());
  checkoutButton.disabled = cart.length === 0;
  updateCartCount();
};

const readOrders = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const getHonorific = () => {
  const gender = window.CafeUtils.getCurrentUser()?.gender;
  if (gender === "princess") return "공주님";
  if (gender === "prince") return "왕자님";
  return "주인님";
};

const getRandomOrderLine = () => {
  const honorific = getHonorific();
  const lines = [
    `${honorific}, 주문이 반짝반짝 준비되고 있어요.`,
    `${honorific}을 위한 달콤한 시간이 곧 도착합니다.`,
    `맛있어지는 주문을 준비할게요, ${honorific}!`,
    `오늘도 new-cafe에서 행복한 한 잔 되세요, ${honorific}.`,
  ];

  return lines[Math.floor(Math.random() * lines.length)];
};

const createOrder = () => {
  const cart = window.CafeUtils.readCart();
  if (cart.length === 0) return null;

  const unavailableItem = cart.find((item) => {
    const menu = window.CafeUtils.getMenuById(item.id);
    return !menu || !menu.isAvailable;
  });

  if (unavailableItem) {
    alert(`${unavailableItem.name} 메뉴는 현재 주문할 수 없습니다.`);
    return null;
  }

  const now = new Date();
  const order = {
    id: `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getTime()).slice(-5)}`,
    orderedAt: now.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    status: "preparing",
    pickupName: window.CafeUtils.getCurrentUser()?.name || "임재현",
    items: cart.map((item) => ({ ...item })),
    memo: getRandomOrderLine(),
  };

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...readOrders()]));
  window.CafeUtils.clearCart();
  return order;
};

basketItems.addEventListener("click", (event) => {
  const article = event.target.closest("[data-id]");
  if (!article) return;

  const menuId = Number(article.dataset.id);
  const quantityField = article.querySelector(".quantity-field");

  if (event.target.closest(".decrease-button")) {
    setQuantity(menuId, Number(quantityField.value) - 1);
  }

  if (event.target.closest(".increase-button")) {
    setQuantity(menuId, Number(quantityField.value) + 1);
  }

  if (event.target.closest(".remove-button")) {
    window.CafeUtils.removeCartItem(menuId);
    renderBasket();
  }
});

basketItems.addEventListener("change", (event) => {
  const field = event.target.closest(".quantity-field");
  if (!field) return;

  const article = event.target.closest("[data-id]");
  setQuantity(Number(article.dataset.id), field.value);
});

clearButton.addEventListener("click", () => {
  window.CafeUtils.clearCart();
  renderBasket();
});

checkoutButton.addEventListener("click", () => {
  const order = createOrder();
  if (!order) return;

  renderBasket();
  window.location.href = `../orders/detail.html?id=${encodeURIComponent(order.id)}`;
});

renderBasket();
