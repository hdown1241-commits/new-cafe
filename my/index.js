const ORDERS_STORAGE_KEY = "new-cafe-orders";
const CART_STORAGE_KEY = "new-cafe-cart";
const PROFILE_STORAGE_KEY = "new-cafe-profile";

const DEFAULT_PROFILE = {
  name: "임재현",
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
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY));
    if (stored && stored.name && stored.email) {
      const migrated = {
        ...stored,
        name: stored.name === "박용우" ? DEFAULT_PROFILE.name : stored.name,
        email: stored.email === "parkyw@example.com" ? DEFAULT_PROFILE.email : stored.email,
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    // fall through to seed on malformed storage
  }

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
  return DEFAULT_PROFILE;
};

const saveProfile = (profile) => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  return profile;
};

const updateCartCount = () => {
  cartCount.textContent = window.CafeUtils.getCartCount();
};

const renderSummary = () => {
  basketCount.textContent = window.CafeUtils.getCartCount();
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
    "정말 탈퇴하시겠습니까? 프로필 정보와 장바구니, 주문 내역이 모두 삭제되며 되돌릴 수 없습니다."
  );

  if (!confirmed) return;

  localStorage.removeItem(PROFILE_STORAGE_KEY);
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(ORDERS_STORAGE_KEY);

  alert("탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.");
  window.location.href = "../index.html";
});

renderProfile();
renderSummary();
updateCartCount();
