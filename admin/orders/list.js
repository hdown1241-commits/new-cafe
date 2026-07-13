const ORDERS_STORAGE_KEY = "new-cafe-orders";

const orderTableBody = document.querySelector("#orderTableBody");
const emptyState = document.querySelector("#emptyState");
const statusFilter = document.querySelector("#statusFilter");
const totalOrders = document.querySelector("#totalOrders");
const activeOrders = document.querySelector("#activeOrders");
const readyOrders = document.querySelector("#readyOrders");
const totalRevenue = document.querySelector("#totalRevenue");

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
      { name: "아메리카노 / Americano", price: 4500, quantity: 1 },
      { name: "바스크 치즈케이크 / Basque Cheesecake", price: 6800, quantity: 1 },
    ],
    memo: "디저트는 따로 포장해주세요.",
  },
  {
    id: "ORD-1002",
    orderedAt: "2026-07-06 12:05",
    status: "ready",
    pickupName: "김하은",
    items: [{ name: "카페 라떼 / Cafe Latte", price: 5200, quantity: 2 }],
    memo: "",
  },
  {
    id: "ORD-1001",
    orderedAt: "2026-07-05 18:40",
    status: "completed",
    pickupName: "최서윤",
    items: [{ name: "아메리카노 / Americano", price: 4500, quantity: 1 }],
    memo: "",
  },
];

const readOrders = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY));
    if (Array.isArray(stored) && stored.length > 0) {
      const migrated = stored.map((order) => {
        const seed = seedOrders.find((seedOrder) => seedOrder.id === order.id);
        if (!seed) return order;
        return {
          ...order,
          pickupName:
            !order.pickupName || order.pickupName === "박용우" || order.pickupName === "임재현"
              ? seed.pickupName
              : order.pickupName,
          items: seed.items,
          memo: seed.memo,
        };
      });
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
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
          <td>${order.pickupName || "임재현"}</td>
          <td><span class="status-badge ${order.status}">${statusLabels[order.status] || order.status}</span></td>
          <td><span class="muted">${getOrderItemCount(order)}개</span></td>
          <td>${window.CafeUtils.formatPrice(getOrderTotal(order))}</td>
          <td><span class="muted">${order.orderedAt}</span></td>
          <td><a class="btn btn--primary" href="./detail.html?id=${order.id}">상세 보기</a></td>
        </tr>
      `
    )
    .join("");
};

statusFilter.addEventListener("change", renderOrders);

renderStats();
renderOrders();
