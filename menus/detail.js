const detailContent = document.querySelector("#detailContent");
const notFoundMessage = document.querySelector("#notFoundMessage");
const cartCount = document.querySelector("#cartCount");

const params = new URLSearchParams(window.location.search);
const menu = window.CafeUtils.getMenuById(params.get("id"));

const getCategoryName = (categoryId) =>
  window.CafeData.categories.find((category) => category.id === categoryId)?.name || "메뉴";

const updateCartCount = () => {
  cartCount.textContent = window.CafeUtils.getCartCount();
};

const renderDetail = () => {
  if (!menu) {
    detailContent.hidden = true;
    notFoundMessage.hidden = false;
    return;
  }

  detailContent.innerHTML = `
    <div class="menu-visual" style="background-image: linear-gradient(145deg, rgba(255, 216, 232, 0.16), rgba(142, 53, 93, 0.22)), url('${menu.image}')" role="img" aria-label="${menu.name}"></div>
    <article class="detail-panel">
      <p class="category-name">${getCategoryName(menu.categoryId)}</p>
      <h1>${menu.name}</h1>
      <p class="description">${menu.description}</p>
      <div class="meta-row">
        ${menu.isSignature ? '<span class="pill">시그니처</span>' : ""}
        <span class="pill">${menu.isAvailable ? "판매중" : "품절"}</span>
      </div>
      <p class="price">${window.CafeUtils.formatPrice(menu.price)}</p>
      <div class="order-box">
        <div class="quantity-control">
          <label for="quantityInput">수량</label>
          <div class="quantity-input">
            <button id="decreaseButton" type="button" aria-label="수량 줄이기">-</button>
            <input id="quantityInput" type="number" value="1" min="1" max="20" />
            <button id="increaseButton" type="button" aria-label="수량 늘리기">+</button>
          </div>
        </div>
        <div class="action-row">
          <button id="addButton" class="add-button" type="button" ${menu.isAvailable ? "" : "disabled"}>${menu.isAvailable ? "장바구니 담기" : "품절"}</button>
          <p id="feedback" class="feedback" aria-live="polite"></p>
        </div>
      </div>
    </article>
  `;
};

const bindOrderEvents = () => {
  if (!menu) return;

  const quantityInput = document.querySelector("#quantityInput");
  const decreaseButton = document.querySelector("#decreaseButton");
  const increaseButton = document.querySelector("#increaseButton");
  const addButton = document.querySelector("#addButton");
  const feedback = document.querySelector("#feedback");

  const setQuantity = (value) => {
    const quantity = Math.min(Math.max(Number(value) || 1, 1), 20);
    quantityInput.value = quantity;
  };

  decreaseButton.addEventListener("click", () => {
    setQuantity(Number(quantityInput.value) - 1);
  });

  increaseButton.addEventListener("click", () => {
    setQuantity(Number(quantityInput.value) + 1);
  });

  quantityInput.addEventListener("input", () => {
    setQuantity(quantityInput.value);
  });

  addButton.addEventListener("click", () => {
    if (!menu.isAvailable) {
      feedback.textContent = "품절된 메뉴입니다.";
      return;
    }

    const quantity = Number(quantityInput.value);

    window.CafeUtils.addToCart(menu, quantity);
    updateCartCount();
    feedback.textContent = `${quantity}개가 장바구니에 담겼습니다.`;
  });
};

renderDetail();
bindOrderEvents();
updateCartCount();
