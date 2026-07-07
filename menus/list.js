const state = {
  categoryId: "all",
  searchTerm: "",
};

const menuGrid = document.querySelector("#menuGrid");
const categoryTabs = document.querySelector("#categoryTabs");
const searchInput = document.querySelector("#searchInput");
const resultTitle = document.querySelector("#resultTitle");
const resultCount = document.querySelector("#resultCount");
const emptyMessage = document.querySelector("#emptyMessage");
const cartCount = document.querySelector("#cartCount");
const adminLink = document.querySelector("#adminLink");

const getCategoryName = (categoryId) =>
  window.CafeData.categories.find((category) => category.id === categoryId)?.name || "Menu";

const getFilteredMenus = () =>
  window.CafeData.menus.filter((menu) => {
    const matchesCategory = state.categoryId === "all" || menu.categoryId === state.categoryId;
    const keyword = state.searchTerm.trim().toLowerCase();
    const matchesSearch =
      keyword.length === 0 ||
      menu.name.toLowerCase().includes(keyword) ||
      menu.description.toLowerCase().includes(keyword);

    return matchesCategory && matchesSearch;
  });

const renderCategoryTabs = () => {
  const categories = [{ id: "all", name: "All" }, ...window.CafeData.categories];

  categoryTabs.innerHTML = categories
    .map(
      (category) => `
        <button
          class="category-tab"
          type="button"
          role="tab"
          aria-selected="${category.id === state.categoryId}"
          data-category-id="${category.id}"
        >
          ${category.name}
        </button>
      `
    )
    .join("");
};

const renderMenus = () => {
  const menus = getFilteredMenus();

  resultTitle.textContent = state.categoryId === "all" ? "All menus" : getCategoryName(state.categoryId);
  resultCount.textContent = `${menus.length} item${menus.length === 1 ? "" : "s"}`;
  emptyMessage.hidden = menus.length > 0;

  menuGrid.innerHTML = menus
    .map(
      (menu) => `
        <article class="menu-card">
          <div>
            <div class="menu-card-header">
              <h3>${menu.name}</h3>
              ${menu.isSignature ? '<span class="badge">Signature</span>' : ""}
            </div>
            <p class="category-name">${getCategoryName(menu.categoryId)}</p>
            <p class="menu-description">${menu.description}</p>
          </div>
          <div class="menu-card-footer">
            <span class="price">${window.CafeUtils.formatPrice(menu.price)}</span>
            <a class="detail-link" href="./detail.html?id=${menu.id}">View</a>
          </div>
        </article>
      `
    )
    .join("");
};

const updateCartCount = () => {
  cartCount.textContent = window.CafeUtils.getCartCount();
};

categoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category-id]");

  if (!button) return;

  state.categoryId = button.dataset.categoryId;
  renderCategoryTabs();
  renderMenus();
});

searchInput.addEventListener("input", (event) => {
  state.searchTerm = event.target.value;
  renderMenus();
});

adminLink.addEventListener("click", (event) => {
  event.preventDefault();
  if (window.CafeUtils.requireAdminAccess()) {
    window.location.href = adminLink.getAttribute("href");
  }
});

renderCategoryTabs();
renderMenus();
updateCartCount();
