const signatureGrid = document.querySelector("#signatureGrid");
const cartCount = document.querySelector("#cartCount");
const seasonalSlides = Array.from(document.querySelectorAll(".seasonal-slide"));
const seasonalDots = document.querySelector(".seasonal-dots");
const seasonalPrevButton = document.querySelector("[data-seasonal-prev]");
const seasonalNextButton = document.querySelector("[data-seasonal-next]");

const fallbackMenus = [
  {
    id: 1,
    name: "아메리카노 / Americano",
    description: "깔끔한 에스프레소에 따뜻한 물을 더한 커피",
    price: 4500,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5a/A_cup_of_Americano_in_Lano_Coffee_%28Palembang%2C_SS%29.jpg",
    isSignature: false,
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

const setupSeasonalSlider = () => {
  if (seasonalSlides.length === 0 || !seasonalDots) return;

  let activeIndex = 0;
  let timerId;

  seasonalDots.innerHTML = seasonalSlides
    .map(
      (_, index) => `
        <button
          class="seasonal-dot${index === 0 ? " is-active" : ""}"
          type="button"
          aria-label="Show seasonal drink ${index + 1}"
          data-seasonal-dot="${index}"
        ></button>
      `
    )
    .join("");

  const dots = Array.from(seasonalDots.querySelectorAll(".seasonal-dot"));

  const showSlide = (nextIndex) => {
    activeIndex = (nextIndex + seasonalSlides.length) % seasonalSlides.length;

    seasonalSlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  const restart = () => {
    clearInterval(timerId);
    timerId = setInterval(() => showSlide(activeIndex + 1), 3500);
  };

  seasonalPrevButton?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    restart();
  });

  seasonalNextButton?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    restart();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.seasonalDot));
      restart();
    });
  });

  restart();
};

setupSeasonalSlider();
renderSignatures();
updateCartCount();
