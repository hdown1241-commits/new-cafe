const ORDERS_STORAGE_KEY = "new-cafe-orders";

const statGrid = document.querySelector("#statGrid");
const menuSummary = document.querySelector("#menuSummary");
const recentOrders = document.querySelector("#recentOrders");

const statusLabels = {
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
};

const seedOrders = [
  {
    id: "ORD-1003",
    orderedAt: "2026-07-06 13:20",
    status: "preparing",
    pickupName: "Customer",
    items: [
      { name: "Americano", price: 4500, quantity: 1 },
      { name: "Basque Cheesecake", price: 6800, quantity: 1 },
    ],
  },
  {
    id: "ORD-1002",
    orderedAt: "2026-07-06 12:05",
    status: "ready",
    pickupName: "Customer",
    items: [{ name: "Cafe Latte", price: 5200, quantity: 2 }],
  },
  {
    id: "ORD-1001",
    orderedAt: "2026-07-05 18:40",
    status: "completed",
    pickupName: "Customer",
    items: [{ name: "Americano", price: 4500, quantity: 1 }],
  },
];

const readOrders = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY));
    if (Array.isArray(stored) && stored.length > 0) return stored;
  } catch {
    // Use seed data when order storage is empty or invalid.
  }

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(seedOrders));
  return seedOrders;
};

const getOrderTotal = (order) =>
  order.items.reduce((total, item) => total + item.price * item.quantity, 0);

const renderStats = () => {
  const menus = window.CafeData.menus;
  const orders = readOrders();
  const availableMenus = menus.filter((menu) => menu.isAvailable).length;
  const activeOrders = orders.filter((order) => order.status !== "completed").length;
  const revenue = orders.reduce((total, order) => total + getOrderTotal(order), 0);

  statGrid.innerHTML = `
    <article class="stat-card">
      <p class="stat-card__label">Total menus</p>
      <p class="stat-card__value">${menus.length}</p>
    </article>
    <article class="stat-card">
      <p class="stat-card__label">Available menus</p>
      <p class="stat-card__value">${availableMenus}</p>
    </article>
    <article class="stat-card">
      <p class="stat-card__label">Active orders</p>
      <p class="stat-card__value">${activeOrders}</p>
    </article>
    <article class="stat-card">
      <p class="stat-card__label">Revenue</p>
      <p class="stat-card__value">${window.CafeUtils.formatPrice(revenue)}</p>
    </article>
  `;
};

const renderMenuSummary = () => {
  const menus = window.CafeData.menus;
  const signatureMenus = menus.filter((menu) => menu.isSignature).length;
  const soldOutMenus = menus.filter((menu) => !menu.isAvailable).length;

  menuSummary.innerHTML = `
    <div class="summary-row">
      <strong>Signature menus</strong>
      <span>${signatureMenus}</span>
    </div>
    <div class="summary-row">
      <strong>Sold out menus</strong>
      <span>${soldOutMenus}</span>
    </div>
    <div class="summary-row">
      <strong>Categories</strong>
      <span>${window.CafeData.categories.length}</span>
    </div>
  `;
};

const renderRecentOrders = () => {
  const orders = readOrders().slice(0, 4);

  recentOrders.innerHTML = orders
    .map(
      (order) => `
        <a class="order-row" href="./orders/detail.html?id=${order.id}">
          <div>
            <strong>${order.id}</strong>
            <span>${order.orderedAt} / ${window.CafeUtils.formatPrice(getOrderTotal(order))}</span>
          </div>
          <span class="status-badge ${order.status}">${statusLabels[order.status] || order.status}</span>
        </a>
      `
    )
    .join("");
};

renderStats();
renderMenuSummary();
renderRecentOrders();
