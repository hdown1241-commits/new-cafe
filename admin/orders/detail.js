const ORDERS_STORAGE_KEY = "new-cafe-orders";

const orderDetail = document.querySelector("#orderDetail");
const notFoundMessage = document.querySelector("#notFoundMessage");

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
    if (Array.isArray(stored)) {
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

const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  return orders;
};

const deleteOrder = (orderId) =>
  saveOrders(readOrders().filter((item) => item.id !== orderId));

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
        <p class="detail-eyebrow">주문 상세</p>
        <h2>${order.id}</h2>
      </div>
      <div class="detail-actions">
        <span class="status-badge ${order.status}">${statusLabels[order.status] || order.status}</span>
        <button type="button" class="btn btn--danger" id="deleteOrderButton">주문 삭제</button>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <span>주문 시간</span>
        <strong>${order.orderedAt}</strong>
      </div>
      <div class="info-item">
        <span>픽업 이름</span>
        <strong>${order.pickupName || "임재현"}</strong>
      </div>
      <div class="info-item">
        <span>총 수량</span>
        <strong>${getOrderItemCount(order)}개</strong>
      </div>
    </div>

    <section class="items-section">
      <h3>주문 메뉴</h3>
      <div class="item-list">
        ${order.items
          .map(
            (item) => `
              <article class="order-item">
                <div>
                  <h4>${item.name}</h4>
                  <p>${window.CafeUtils.formatPrice(item.price)} × ${item.quantity}</p>
                </div>
                <span class="item-price">${window.CafeUtils.formatPrice(item.price * item.quantity)}</span>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="memo-section">
      <h3>요청 사항</h3>
      <p>${order.memo || "별도 요청 사항이 없습니다."}</p>
    </section>

    <div class="total-row">
      <span>총 결제 금액</span>
      <strong>${window.CafeUtils.formatPrice(getOrderTotal(order))}</strong>
    </div>
  `;
};

renderOrder();

const deleteOrderButton = document.querySelector("#deleteOrderButton");
if (deleteOrderButton && order) {
  deleteOrderButton.addEventListener("click", () => {
    const confirmed = confirm(`${order.id} 주문을 삭제할까요?`);
    if (!confirmed) return;

    deleteOrder(order.id);
    location.href = "./list.html";
  });
}
