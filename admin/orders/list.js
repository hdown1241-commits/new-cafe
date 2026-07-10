const ORDERS_STORAGE_KEY = "new-cafe-orders";

const orderTableBody = document.querySelector("#orderTableBody");
const emptyState = document.querySelector("#emptyState");
const statusFilter = document.querySelector("#statusFilter");
const totalOrders = document.querySelector("#totalOrders");
const activeOrders = document.querySelector("#activeOrders");
const readyOrders = document.querySelector("#readyOrders");
const totalRevenue = document.querySelector("#totalRevenue");

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
    memo: "Please pack dessert separately.",
  },
  {
    id: "ORD-1002",
    orderedAt: "2026-07-06 12:05",
    status: "ready",
    pickupName: "Customer",
    items: [{ name: "Cafe Latte", price: 5200, quantity: 2 }],
    memo: "",
  },
  {
    id: "ORD-1001",
    orderedAt: "2026-07-05 18:40",
    status: "completed",
    pickupName: "Customer",
    items: [{ name: "Americano", price: 4500, quantity: 1 }],
    memo: "",
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

const getOrderItemCount = (order) =>
  order.items.reduce((total, item) => total + item.quantity, 0);

const getFilteredOrders = () => {
  const status = statusFilter.value;
  const orders = readOrders();
  return status === "all" ? orders : orders.filter((order) => order.status === status);
};

const renderStats = () => {
  const orders = readOrders();
  const revenue = orders.reduce((total, order) => total + getOrderTotal(order), 0);

  totalOrders.textContent = orders.length;
  activeOrders.textContent = orders.filter((order) => order.status !== "completed").length;
  readyOrders.textContent = orders.filter((order) => order.status === "ready").length;
  totalRevenue.textContent = window.CafeUtils.formatPrice(revenue);
};

const renderOrders = () => {
  const orders = getFilteredOrders();
  emptyState.hidden = orders.length > 0;

  orderTableBody.innerHTML = orders
    .map(
      (order) => `
        <tr>
          <td><a class="order-id" href="./detail.html?id=${order.id}">${order.id}</a></td>
          <td>${order.pickupName || "Customer"}</td>
          <td><span class="status-badge ${order.status}">${statusLabels[order.status] || order.status}</span></td>
          <td><span class="muted">${getOrderItemCount(order)} item(s)</span></td>
          <td>${window.CafeUtils.formatPrice(getOrderTotal(order))}</td>
          <td><span class="muted">${order.orderedAt}</span></td>
          <td><a class="btn btn--primary" href="./detail.html?id=${order.id}">View detail</a></td>
        </tr>
      `
    )
    .join("");
};

statusFilter.addEventListener("change", renderOrders);

renderStats();
renderOrders();
