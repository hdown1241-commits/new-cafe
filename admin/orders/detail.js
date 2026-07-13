const ORDERS_STORAGE_KEY = "new-cafe-orders";

const orderDetail = document.querySelector("#orderDetail");
const notFoundMessage = document.querySelector("#notFoundMessage");

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
    pickupName: "임재현",
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
    pickupName: "임재현",
    items: [{ name: "Cafe Latte", price: 5200, quantity: 2 }],
    memo: "",
  },
  {
    id: "ORD-1001",
    orderedAt: "2026-07-05 18:40",
    status: "completed",
    pickupName: "임재현",
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

const params = new URLSearchParams(window.location.search);
const order = readOrders().find((item) => item.id === params.get("id"));

const renderOrder = () => {
  if (!order) {
    orderDetail.hidden = true;
    notFoundMessage.hidden = false;
    return;
  }

  orderDetail.innerHTML = `
    <div class="detail-heading">
      <div>
        <p class="detail-eyebrow">Order detail</p>
        <h2>${order.id}</h2>
      </div>
      <span class="status-badge ${order.status}">${statusLabels[order.status] || order.status}</span>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <span>Ordered at</span>
        <strong>${order.orderedAt}</strong>
      </div>
      <div class="info-item">
        <span>Pickup name</span>
        <strong>${order.pickupName || "임재현"}</strong>
      </div>
      <div class="info-item">
        <span>Total quantity</span>
        <strong>${getOrderItemCount(order)} item(s)</strong>
      </div>
    </div>

    <section class="items-section">
      <h3>Ordered items</h3>
      <div class="item-list">
        ${order.items
          .map(
            (item) => `
              <article class="order-item">
                <div>
                  <h4>${item.name}</h4>
                  <p>${window.CafeUtils.formatPrice(item.price)} x ${item.quantity}</p>
                </div>
                <span class="item-price">${window.CafeUtils.formatPrice(item.price * item.quantity)}</span>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="memo-section">
      <h3>Memo</h3>
      <p>${order.memo || "No memo was added to this order."}</p>
    </section>

    <div class="total-row">
      <span>Total payment</span>
      <strong>${window.CafeUtils.formatPrice(getOrderTotal(order))}</strong>
    </div>
  `;
};

renderOrder();
