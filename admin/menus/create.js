(() => {
  const form = document.getElementById("menuForm");
  const categorySelect = document.getElementById("categoryId");
  const imageInput = document.getElementById("image");
  const previewBox = document.getElementById("previewBox");

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

  imageInput.addEventListener("input", updatePreview);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const menu = window.CafeData.addMenu({
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
