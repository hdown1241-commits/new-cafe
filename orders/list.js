window.CafeUtils.requireAuth();

const ORDERS_STORAGE_KEY = "new-cafe-orders";

const orderList = document.querySelector("#orderList");
const emptyMessage = document.querySelector("#emptyMessage");
const statusFilter = document.querySelector("#statusFilter");
const totalOrders = document.querySelector("#totalOrders");
const activeOrders = document.querySelector("#activeOrders");
const totalAmount = document.querySelector("#totalAmount");
const cartCount = document.querySelector("#cartCount");

const statusLabels = {
  preparing: "준비 중",
  ready: "픽업 가능",
  completed: "완료",
};

const seedOrders = [
  {
    id: "ORD-1003",
    orderedAt: "2026-07-06 13:20",
    status: "preparing",
    pickupName: "임재현",
    items: [
      { name: "Americano", price: 4500, quantity: 1 },
      { name: "Basque Cheesecake", price: 6800, quantity: 1 },
    ],
  },
  {
    id: "ORD-1002",
    orderedAt: "2026-07-06 12:05",
    status: "ready",
    pickupName: "김하은",
    items: [{ name: "Cafe Latte", price: 5200, quantity: 2 }],
  },
  {
    id: "ORD-1001",
    orderedAt: "2026-07-05 18:40",
    status: "completed",
    pickupName: "최서윤",
    items: [{ name: "Americano", price: 4500, quantity: 1 }],
  },
];

const readOrders = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY));
    if (Array.isArray(stored) && stored.length > 0) {
      const migrated = stored.map((order) => {
        const seed = seedOrders.find((seedOrder) => seedOrder.id === order.id);
        if (!seed) return order;
        if (!order.pickupName || order.pickupName === "박용우" || order.pickupName === "임재현") {
          return { ...order, pickupName: seed.pickupName };
        }
        return order;
      });
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    // Use seed data when stored data is missing or invalid.
  }

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(seedOrders));
  return seedOrders;
};

const getOrderTotal = (order) =>
  order.items.reduce((total, item) => total + item.price * item.quantity, 0);

const getFilteredOrders = () => {
  const orders = readOrders();
  const status = statusFilter.value;

  return status === "all" ? orders : orders.filter((order) => order.status === status);
};

const renderSummary = () => {
  const orders = readOrders();
  const activeCount = orders.filter((order) => order.status !== "completed").length;
  const amount = orders.reduce((total, order) => total + getOrderTotal(order), 0);

  totalOrders.textContent = orders.length;
  activeOrders.textContent = activeCount;
  totalAmount.textContent = window.CafeUtils.formatPrice(amount);
};

const renderOrders = () => {
  const orders = getFilteredOrders();

  emptyMessage.hidden = orders.length > 0;
  orderList.innerHTML = orders
    .map(
      (order) => `
        <article class="order-card">
          <div>
            <div class="order-title">
              <h3>${order.id}</h3>
              <span class="status-badge ${order.status}">${statusLabels[order.status]}</span>
            </div>
            <p class="order-meta">
              <span>${order.orderedAt}</span>
              <span>${order.items.length}개 메뉴</span>
              <span>픽업: ${order.pickupName}</span>
            </p>
          </div>
          <div class="order-actions">
            <span class="order-price">${window.CafeUtils.formatPrice(getOrderTotal(order))}</span>
            <a class="detail-link" href="./detail.html?id=${order.id}">상세 보기</a>
          </div>
        </article>
      `
    )
    .join("");
};

const updateCartCount = () => {
  cartCount.textContent = window.CafeUtils.getCartCount();
};

statusFilter.addEventListener("change", () => {
  renderOrders();
});

renderSummary();
renderOrders();
updateCartCount();
