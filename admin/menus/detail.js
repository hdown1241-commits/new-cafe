(() => {
  const params = new URLSearchParams(location.search);
  const menuId = params.get("id");
  const content = document.getElementById("detailContent");
  const notFound = document.getElementById("notFound");

  const menu = menuId ? window.CafeUtils.getMenuById(menuId) : null;

  if (!menu) {
    notFound.hidden = false;
    return;
  }

  const category = window.CafeData.getCategoryById(menu.categoryId);

  content.innerHTML = `
    <div class="detail-card">
      <div class="detail-card__image">
        ${menu.image ? `<img src="${menu.image}" alt="${menu.name}" />` : "☕"}
      </div>
      <div class="detail-card__body">
        <div class="detail-card__header">
          <h2 class="detail-card__name">${menu.name}</h2>
          <span class="badge ${menu.isSignature ? "badge--signature" : "badge--muted"}">${menu.isSignature ? "시그니처" : "일반"}</span>
          <span class="badge ${menu.isAvailable ? "badge--ok" : "badge--soldout"}">${menu.isAvailable ? "판매중" : "품절"}</span>
        </div>
        <p class="detail-card__category">${category ? category.name : "-"}</p>
        <p class="detail-card__price">${window.CafeUtils.formatPrice(menu.price)}</p>
        <p class="detail-card__description">${menu.description || "설명이 없습니다."}</p>
        <div class="detail-card__actions">
          <a class="btn btn--primary" href="edit.html?id=${menu.id}">수정</a>
          <button type="button" class="btn btn--danger" id="deleteBtn">삭제</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("deleteBtn").addEventListener("click", () => {
    if (confirm(`"${menu.name}" 메뉴를 삭제할까요?`)) {
      window.CafeData.deleteMenu(menu.id);
      location.href = "list.html";
    }
  });
})();
