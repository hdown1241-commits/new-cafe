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
const params = new URLSearchParams(window.location.search);
const initialCategoryId = params.get("category");

const getCategoryName = (categoryId) =>
  window.CafeData.categories.find((category) => category.id === categoryId)?.name || "메뉴";

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
  const categories = [{ id: "all", name: "전체" }, ...window.CafeData.categories];

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

const setInitialCategory = () => {
  if (!initialCategoryId) return;

  const categoryExists =
    initialCategoryId === "all" ||
    window.CafeData.categories.some((category) => category.id === initialCategoryId);

  if (categoryExists) state.categoryId = initialCategoryId;
};

const renderMenus = () => {
  const menus = getFilteredMenus();

  resultTitle.textContent = state.categoryId === "all" ? "전체 메뉴" : getCategoryName(state.categoryId);
  resultCount.textContent = `${menus.length}개`;
  emptyMessage.hidden = menus.length > 0;
  const hasSearchTerm = state.searchTerm.trim().length > 0;
  const shouldCompact = state.categoryId !== "all" && state.categoryId !== "seasonal";
  menuGrid.classList.toggle("is-compact", shouldCompact || hasSearchTerm);

  menuGrid.innerHTML = menus
    .map(
      (menu) => `
        <article class="menu-card">
          <a class="menu-card-image" href="./detail.html?id=${menu.id}">
            <img src="${menu.image}" alt="${menu.name}" loading="lazy" />
          </a>
          <div>
            <div class="menu-card-header">
              <h3>${menu.name}</h3>
              <div class="badge-row">
                ${menu.isSignature ? '<span class="badge">시그니처</span>' : ""}
                ${!menu.isAvailable ? '<span class="badge badge--soldout">품절</span>' : ""}
              </div>
            </div>
            <p class="category-name">${getCategoryName(menu.categoryId)}</p>
            <p class="menu-description">${menu.description}</p>
          </div>
          <div class="menu-card-footer">
            <span class="price">${window.CafeUtils.formatPrice(menu.price)}</span>
            <a class="detail-link" href="./detail.html?id=${menu.id}">보기</a>
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

setInitialCategory();
renderCategoryTabs();
renderMenus();
updateCartCount();
