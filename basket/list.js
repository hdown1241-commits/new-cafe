window.CafeUtils.requireAuth();

const basketItems = document.querySelector("#basketItems");
const basketLayout = document.querySelector(".basket-layout");
const summaryCount = document.querySelector("#summaryCount");
const summaryTotal = document.querySelector("#summaryTotal");
const clearButton = document.querySelector("#clearButton");
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
            <p class="unit-price">${window.CafeUtils.formatPrice(item.price)} each</p>
          </div>
          <div class="quantity-input">
            <button type="button" class="decrease-button" aria-label="Decrease quantity">-</button>
            <input type="number" class="quantity-field" value="${item.quantity}" min="1" max="20" />
            <button type="button" class="increase-button" aria-label="Increase quantity">+</button>
          </div>
          <p class="line-total">${window.CafeUtils.formatPrice(item.price * item.quantity)}</p>
          <button type="button" class="remove-button" aria-label="Remove ${item.name}">Remove</button>
        </article>
      `
    )
    .join("");

  summaryCount.textContent = window.CafeUtils.getCartCount();
  summaryTotal.textContent = window.CafeUtils.formatPrice(window.CafeUtils.getCartTotal());
  updateCartCount();
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

renderBasket();
