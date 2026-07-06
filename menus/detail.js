const detailContent = document.querySelector("#detailContent");
const notFoundMessage = document.querySelector("#notFoundMessage");
const cartCount = document.querySelector("#cartCount");

const params = new URLSearchParams(window.location.search);
const menu = window.CafeUtils.getMenuById(params.get("id"));

const getCategoryName = (categoryId) =>
  window.CafeData.categories.find((category) => category.id === categoryId)?.name || "Menu";

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
    <div class="menu-visual" role="img" aria-label="${menu.name}"></div>
    <article class="detail-panel">
      <p class="category-name">${getCategoryName(menu.categoryId)}</p>
      <h1>${menu.name}</h1>
      <p class="description">${menu.description}</p>
      <div class="meta-row">
        ${menu.isSignature ? '<span class="pill">Signature</span>' : ""}
        <span class="pill">${menu.isAvailable ? "Available" : "Sold out"}</span>
      </div>
      <p class="price">${window.CafeUtils.formatPrice(menu.price)}</p>
      <div class="order-box">
        <div class="quantity-control">
          <label for="quantityInput">Quantity</label>
          <div class="quantity-input">
            <button id="decreaseButton" type="button" aria-label="Decrease quantity">-</button>
            <input id="quantityInput" type="number" value="1" min="1" max="20" />
            <button id="increaseButton" type="button" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="action-row">
          <button id="addButton" class="add-button" type="button">Add to basket</button>
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
    const quantity = Number(quantityInput.value);

    window.CafeUtils.addToCart(menu, quantity);
    updateCartCount();
    feedback.textContent = `${quantity} item${quantity === 1 ? "" : "s"} added.`;
  });
};

renderDetail();
bindOrderEvents();
updateCartCount();
