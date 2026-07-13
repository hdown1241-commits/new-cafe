const loginForm = document.querySelector("#loginForm");
const nameInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");
const cartCount = document.querySelector("#cartCount");

const params = new URLSearchParams(window.location.search);
const returnTo = params.get("returnTo");

cartCount.textContent = window.CafeUtils.getCartCount();

if (window.CafeUtils.isLoggedIn() && returnTo) {
  window.location.href = returnTo;
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) return;

  window.CafeUtils.login({ name, email });
  window.location.href = returnTo || "../my/index.html";
});
