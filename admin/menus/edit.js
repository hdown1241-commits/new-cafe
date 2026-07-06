(() => {
  const params = new URLSearchParams(location.search);
  const menuId = params.get("id");
  const form = document.getElementById("menuForm");
  const notFound = document.getElementById("notFound");
  const categorySelect = document.getElementById("categoryId");
  const imageInput = document.getElementById("image");
  const previewBox = document.getElementById("previewBox");

  const menu = menuId ? window.CafeUtils.getMenuById(menuId) : null;

  if (!menu) {
    notFound.hidden = false;
    return;
  }

  window.CafeData.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  const updatePreview = () => {
    const url = imageInput.value.trim();
    previewBox.innerHTML = url
      ? `<img src="${url}" alt="미리보기" onerror="this.replaceWith(document.createTextNode('☕'))" />`
      : "☕";
  };

  form.name.value = menu.name;
  form.categoryId.value = menu.categoryId;
  form.price.value = menu.price;
  form.description.value = menu.description || "";
  form.image.value = menu.image || "";
  form.isSignature.checked = Boolean(menu.isSignature);
  form.isAvailable.checked = Boolean(menu.isAvailable);
  form.hidden = false;
  updatePreview();

  imageInput.addEventListener("input", updatePreview);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    window.CafeData.updateMenu(menu.id, {
      name: formData.get("name").trim(),
      categoryId: formData.get("categoryId"),
      price: formData.get("price"),
      description: formData.get("description").trim(),
      image: formData.get("image").trim(),
      isSignature: formData.get("isSignature") === "on",
      isAvailable: formData.get("isAvailable") === "on",
    });

    location.href = `detail.html?id=${menu.id}`;
  });
})();
