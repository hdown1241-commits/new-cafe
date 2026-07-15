const loginForm = document.querySelector("#loginForm");
const nameInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");
const cartCount = document.querySelector("#cartCount");

const params = new URLSearchParams(window.location.search);
const returnTo = params.get("returnTo");

const getFallbackReturnTo = () => {
  const appBase = window.location.pathname.startsWith("/new-cafe/") ? "/new-cafe" : "";

  try {
    const referrer = new URL(document.referrer);
    const current = new URL(window.location.href);
    const isLoginPage = referrer.pathname.endsWith("/auth/login.html");

    if (referrer.origin === current.origin && !isLoginPage) {
      return `${referrer.pathname}${referrer.search}${referrer.hash}`;
    }
  } catch {
    // Ignore missing or cross-origin referrers.
  }

  return `${appBase}/my/index.html`;
};

const redirectAfterLogin = returnTo || getFallbackReturnTo();

cartCount.textContent = window.CafeUtils.getCartCount();

if (window.CafeUtils.isLoggedIn()) {
  window.location.href = redirectAfterLogin;
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) return;

  window.CafeUtils.login({ name, email });
  window.location.href = redirectAfterLogin;
});
