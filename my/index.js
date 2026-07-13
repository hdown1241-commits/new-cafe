window.CafeUtils.requireAuth();

const ORDERS_STORAGE_KEY = "new-cafe-orders";
const CART_STORAGE_KEY = "new-cafe-cart";
const LEGACY_PROFILE_STORAGE_KEY = "new-cafe-profile";
const PROFILE_STORAGE_KEY = "new-cafe-profile-v2";

const DEFAULT_PROFILE = {
  name: "\uc784\uc7ac\ud604",
  email: "limjh@example.com",
  joinedAt: "2026.03.02",
};

const cartCount = document.querySelector("#cartCount");
const basketCount = document.querySelector("#basketCount");
const basketTotal = document.querySelector("#basketTotal");
const orderCount = document.querySelector("#orderCount");

const profileAvatar = document.querySelector("#profileAvatar");
const profileView = document.querySelector("#profileView");
const profileName = document.querySelector("#profileName");
const profileEmail = document.querySelector("#profileEmail");
const profileJoinedAt = document.querySelector("#profileJoinedAt");

const editProfileButton = document.querySelector("#editProfileButton");
const cancelEditButton = document.querySelector("#cancelEditButton");
const profileEditForm = document.querySelector("#profileEditForm");
const nameInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");

const withdrawButton = document.querySelector("#withdrawButton");

const readOrderCount = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY));
    return Array.isArray(stored) ? stored.length : 0;
  } catch {
    return 0;
  }
};

const readProfile = () => {
  const currentUser = window.CafeUtils.getCurrentUser();

  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY));
    if (stored && stored.name && stored.email) {
      if (currentUser && (stored.email !== currentUser.email || stored.name !== currentUser.name)) {
        const synced = { ...stored, name: currentUser.name, email: currentUser.email };
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(synced));
        return synced;
      }
      return stored;
    }
  } catch {
    // fall through to seed on malformed storage
  }

  localStorage.removeItem(LEGACY_PROFILE_STORAGE_KEY);
  const profile = currentUser ? { ...DEFAULT_PROFILE, name: currentUser.name, email: currentUser.email } : DEFAULT_PROFILE;
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  return profile;
};

const saveProfile = (profile) => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  return profile;
};

const updateCartCount = () => {
  cartCount.textContent = window.CafeUtils.getCartCount();
};

const renderSummary = () => {
  const currentCartCount = window.CafeUtils.getCartCount();

  cartCount.textContent = currentCartCount;
  basketCount.textContent = currentCartCount;
  basketTotal.textContent = window.CafeUtils.formatPrice(window.CafeUtils.getCartTotal());
  orderCount.textContent = readOrderCount();
};

const renderProfile = () => {
  const profile = readProfile();

  profileName.textContent = profile.name;
  profileEmail.textContent = profile.email;
  profileJoinedAt.textContent = profile.joinedAt;
  profileAvatar.textContent = profile.name.slice(0, 1);
};

const openEditForm = () => {
  const profile = readProfile();

  nameInput.value = profile.name;
  emailInput.value = profile.email;
  profileView.hidden = true;
  profileEditForm.hidden = false;
  nameInput.focus();
};

const closeEditForm = () => {
  profileEditForm.hidden = true;
  profileView.hidden = false;
};

const renderPage = () => {
  renderProfile();
  renderSummary();
};

editProfileButton.addEventListener("click", openEditForm);
cancelEditButton.addEventListener("click", closeEditForm);

profileEditForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) return;

  const profile = readProfile();
  saveProfile({ ...profile, name, email });
  renderProfile();
  closeEditForm();
});

withdrawButton.addEventListener("click", () => {
  const confirmed = confirm(
    "\uc815\ub9d0 \ud0c8\ud1f4\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c? \ud504\ub85c\ud544 \uc815\ubcf4\uc640 \uc7a5\ubc14\uad6c\ub2c8, \uc8fc\ubb38 \ub0b4\uc5ed\uc774 \ubaa8\ub450 \uc0ad\uc81c\ub418\uba70 \ub418\ub3cc\ub9b4 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4."
  );

  if (!confirmed) return;

  localStorage.removeItem(PROFILE_STORAGE_KEY);
  localStorage.removeItem(LEGACY_PROFILE_STORAGE_KEY);
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(ORDERS_STORAGE_KEY);

  alert("\ud0c8\ud1f4\uac00 \uc644\ub8cc\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \uc774\uc6a9\ud574\uc8fc\uc154\uc11c \uac10\uc0ac\ud569\ub2c8\ub2e4.");
  window.location.href = "../index.html";
});

window.addEventListener("pageshow", renderPage);
window.addEventListener("focus", renderSummary);
window.addEventListener("storage", (event) => {
  if ([CART_STORAGE_KEY, ORDERS_STORAGE_KEY].includes(event.key)) {
    renderSummary();
  }
});
window.addEventListener("cafe:cart-updated", renderSummary);

renderPage();
