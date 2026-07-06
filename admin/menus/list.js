(() => {
  const statGrid = document.getElementById("statGrid");
  const categoryFilter = document.getElementById("categoryFilter");
  const tableBody = document.getElementById("menuTableBody");
  const emptyState = document.getElementById("emptyState");

  let activeCategory = "all";

  const thumbCell = (menu) => `
    <div class="menu-thumb">
      ${menu.image ? `<img src="${menu.image}" alt="${menu.name}" loading="lazy" />` : "☕"}
    </div>
  `;

  const renderStats = () => {
    const menus = window.CafeData.menus;
    const total = menus.length;
    const signature = menus.filter((menu) => menu.isSignature).length;
    const soldOut = menus.filter((menu) => !menu.isAvailable).length;

    statGrid.innerHTML = `
      <div class="stat-card">
        <p class="stat-card__label">전체 메뉴</p>
        <p class="stat-card__value">${total}</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__label">시그니처 메뉴</p>
        <p class="stat-card__value">${signature}</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__label">품절 메뉴</p>
        <p class="stat-card__value">${soldOut}</p>
      </div>
    `;
  };

  const renderCategoryChips = () => {
    window.CafeData.categories.forEach((category) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "filter-chip";
      chip.dataset.category = category.id;
      chip.textContent = category.name;
      categoryFilter.appendChild(chip);
    });
  };

  const getFilteredMenus = () => {
    if (activeCategory === "all") return window.CafeData.menus;
    return window.CafeUtils.getMenusByCategory(activeCategory);
  };

  const renderTable = () => {
    const menus = getFilteredMenus();
    tableBody.innerHTML = "";
    emptyState.hidden = menus.length > 0;

    menus.forEach((menu) => {
      const category = window.CafeData.getCategoryById(menu.categoryId);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="menu-table__thumb-cell">${thumbCell(menu)}</td>
        <td>
          <div class="menu-table__name-cell">
            <a class="menu-table__name" href="detail.html?id=${menu.id}">${menu.name}</a>
            <span class="menu-table__desc">${menu.description || ""}</span>
          </div>
        </td>
        <td>${category ? category.name : "-"}</td>
        <td>${window.CafeUtils.formatPrice(menu.price)}</td>
        <td><span class="badge ${menu.isSignature ? "badge--signature" : "badge--muted"}">${menu.isSignature ? "시그니처" : "-"}</span></td>
        <td><span class="badge ${menu.isAvailable ? "badge--ok" : "badge--soldout"}">${menu.isAvailable ? "판매중" : "품절"}</span></td>
        <td>
          <div class="row-actions">
            <a class="btn btn--ghost btn--sm" href="edit.html?id=${menu.id}">수정</a>
            <button type="button" class="btn btn--danger btn--sm" data-delete="${menu.id}">삭제</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  };

  const renderAll = () => {
    renderStats();
    renderTable();
  };

  categoryFilter.addEventListener("click", (event) => {
    const chip = event.target.closest(".filter-chip");
    if (!chip) return;
    activeCategory = chip.dataset.category;
    categoryFilter
      .querySelectorAll(".filter-chip")
      .forEach((el) => el.classList.toggle("is-active", el === chip));
    renderTable();
  });

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    const menuId = button.dataset.delete;
    const menu = window.CafeUtils.getMenuById(menuId);
    if (!menu) return;
    if (confirm(`"${menu.name}" 메뉴를 삭제할까요?`)) {
      window.CafeData.deleteMenu(menuId);
      renderAll();
    }
  });

  renderCategoryChips();
  renderAll();
})();
