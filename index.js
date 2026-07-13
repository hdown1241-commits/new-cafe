const signatureGrid = document.querySelector("#signatureGrid");
const cartCount = document.querySelector("#cartCount");

const fallbackMenus = [
  {
    id: 1,
    name: "Americano",
    description: "Clean espresso with hot water.",
    price: 4500,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5a/A_cup_of_Americano_in_Lano_Coffee_%28Palembang%2C_SS%29.jpg",
    isSignature: true,
  },
  {
    id: 2,
    name: "Cafe Latte",
    description: "Espresso with steamed milk.",
    price: 5200,
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Caffe_Latte_cup.jpg",
    isSignature: true,
  },
  {
    id: 5,
    name: "Basque Cheesecake",
    description: "Creamy cheesecake with a caramelized top.",
    price: 6800,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/ee/Chestnut_Basque_Cheesecake_-_MOGUMOGU_2024-11-02.jpg",
    isSignature: true,
  },
];

const formatPrice = (price) => {
  if (window.CafeUtils?.formatPrice) return window.CafeUtils.formatPrice(price);

  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(price);
};

const getMenus = () => {
  const menus = window.CafeData?.menus;

  if (Array.isArray(menus) && menus.length > 0) return menus;
  return fallbackMenus;
};

const renderSignatures = () => {
  const menus = getMenus();
  const signatures = menus.filter((menu) => menu.isSignature).slice(0, 3);
  const visibleMenus = signatures.length > 0 ? signatures : menus.slice(0, 3);

  signatureGrid.innerHTML = visibleMenus
    .map(
      (menu) => `
        <article class="menu-card">
          <img src="${menu.image || fallbackMenus[0].image}" alt="${menu.name}" loading="lazy" />
          <div class="menu-card-body">
            <h3>${menu.name}</h3>
            <p>${menu.description || "Cafe menu item"}</p>
            <div class="menu-card-footer">
              <span class="price">${formatPrice(menu.price)}</span>
              <a class="menu-link" href="./menus/detail.html?id=${menu.id}">View</a>
            </div>
          </div>
        </article>
      `
    )
    .join("");
};

const updateCartCount = () => {
  cartCount.textContent = window.CafeUtils?.getCartCount ? window.CafeUtils.getCartCount() : 0;
};

renderSignatures();
updateCartCount();
