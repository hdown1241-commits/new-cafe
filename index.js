const signatureGrid = document.querySelector("#signatureGrid");
const cartCount = document.querySelector("#cartCount");

const fallbackMenus = [
  {
    id: 1,
    name: "아메리카노 / Americano",
    description: "깔끔한 에스프레소에 따뜻한 물을 더한 커피",
    price: 4500,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5a/A_cup_of_Americano_in_Lano_Coffee_%28Palembang%2C_SS%29.jpg",
    isSignature: true,
  },
  {
    id: 2,
    name: "카페 라떼 / Cafe Latte",
    description: "에스프레소에 부드러운 스팀 밀크를 더한 커피",
    price: 5200,
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Caffe_Latte_cup.jpg",
    isSignature: true,
  },
  {
    id: 5,
    name: "바스크 치즈케이크 / Basque Cheesecake",
    description: "진한 치즈 풍미와 그을린 윗면이 매력적인 디저트",
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
            <p>${menu.description || "카페 메뉴"}</p>
            <div class="menu-card-footer">
              <span class="price">${formatPrice(menu.price)}</span>
              <a class="menu-link" href="./menus/detail.html?id=${menu.id}">보기</a>
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
