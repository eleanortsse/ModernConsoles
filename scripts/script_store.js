function toNum(str) {
    const num = Number(str.replace(/ /g, ""));
    return num;
  }
  
  function toCurrency(num) {
    const format = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(num);
    return format;
  }
  
  // Корзина
  
  const cardAddArr = Array.from(document.querySelectorAll(".card__add"));
  const cartNum = document.querySelector("#cart_num");
  const cart = document.querySelector("#cart");
  
  class Cart {
    products;
    constructor() {
      this.products = [];
    }
    get count() {
      return this.products.length;
    }
    addProduct(product) {
      this.products.push(product);
    }
    removeProduct(index) {
      this.products.splice(index, 1);
    }
    get cost() {
      const prices = this.products.map((product) => {
        return toNum(product.price) * product.amount;
      });
      const sum = prices.reduce((acc, num) => {
        return acc + num;
      }, 0);
      return sum;
    }
    get costDiscount() {
      const prices = this.products.map((product) => {
        return toNum(product.priceDiscount)*product.amount;
      });
      const sum = prices.reduce((acc, num) => {
        return acc + num;
      }, 0);
      return sum;
    }
    get discount() {
      return this.cost - this.costDiscount;
    }
    increaseProductQuantity(product) {
        const index = this.products.findIndex(p => p.name === product.name);
        if (index !== -1) {
          this.products[index].amount += 1;
        }
      }
    
      // Функция для уменьшения количества товара на 1
      decreaseProductQuantity(product) {
        const index = this.products.findIndex(p => p.name === product.name);
        if (index !== -1 && this.products[index].amount > 1) {
          this.products[index].amount -= 1;
        }
      }
  }
  
  class Product {
    imageSrc;
    name;
    price;
    priceDiscount;
    amount;
    constructor(card) {
      this.imageSrc = card.querySelector(".card__image").children[0].src;
      this.name = card.querySelector(".card__title").innerText;
      this.price = card.querySelector(".card__price--common").innerText;
      this.priceDiscount = card.querySelector(".card__price--discount").innerText;
      this.amount = 1;
    }
  }
  
  const myCart = new Cart();
  
  if (localStorage.getItem("cart") == null) {
    localStorage.setItem("cart", JSON.stringify(myCart));
  }
  
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  myCart.products = savedCart.products;
  cartNum.textContent = myCart.count;
  

  myCart.products = cardAddArr.forEach((cardAdd) => {
    cardAdd.addEventListener("click", (e) => {
      e.preventDefault();
      const card = e.target.closest(".card");
      const product = new Product(card);
      const savedCart = JSON.parse(localStorage.getItem("cart"));
      myCart.products = savedCart.products;
  
      const existingProductIndex = myCart.products.findIndex(p => p.name === product.name);
      if (existingProductIndex !== -1) {
        myCart.increaseProductQuantity(myCart.products[existingProductIndex]);
      } else {
        myCart.addProduct(product);
      }
  
      localStorage.setItem("cart", JSON.stringify(myCart));
      cartNum.textContent = myCart.count;
      popupContainerFill();
    });
  });
  
  // Попап
  
  const popup = document.querySelector(".popup");
  const popupClose = document.querySelector("#popup_close");
  const body = document.body;
  const popupContainer = document.querySelector("#popup_container");
  const popupProductList = document.querySelector("#popup_product_list");
  const popupCost = document.querySelector("#popup_cost");
  const popupDiscount = document.querySelector("#popup_discount");
  const popupCostDiscount = document.querySelector("#popup_cost_discount");
  
  cart.addEventListener("click", (e) => {
    e.preventDefault();
    popup.classList.add("popup--open");
    body.classList.add("lock");
    popupContainerFill();
  });
  
  function popupContainerFill() {
    popupProductList.innerHTML = null;
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    myCart.products = savedCart.products;
    const productsHTML = myCart.products.map((product) => {
      const productItem = document.createElement("div");
      productItem.classList.add("popup__product");
  
      const productWrap1 = document.createElement("div");
      productWrap1.classList.add("popup__product-wrap");
      const productWrap2 = document.createElement("div");
      productWrap2.classList.add("popup__product-wrap");
  
      const productImage = document.createElement("img");
      productImage.classList.add("popup__product-image");
      productImage.setAttribute("src", product.imageSrc);
  
      const productTitle = document.createElement("h2");
      productTitle.classList.add("popup__product-title");
      productTitle.innerHTML = product.name;
        
      const productPrice = document.createElement("div");
      productPrice.classList.add("popup__product-price");
      productPrice.innerHTML = toCurrency(toNum(product.priceDiscount));
  
      const productDelete = document.createElement("button");
      productDelete.classList.add("popup__product-delete");
      productDelete.innerHTML = "&#10006;";
  
      //+-
    const productQuantity = document.createElement("span");
    productQuantity.classList.add("popup__product-quantity");
    productQuantity.textContent = `${product.amount}`;

      const productMore = document.createElement("button");
      productMore.classList.add("popup__product-more");
      productMore.innerHTML = "+";

      productMore.addEventListener("click", () => {
      myCart.increaseProductQuantity(product);
      localStorage.setItem("cart", JSON.stringify(myCart));
      popupContainerFill();
  });

  const productLess = document.createElement("button");
  productLess.classList.add("popup__product-less");
  productLess.innerHTML = "-";

  productLess.addEventListener("click", () => {
    myCart.decreaseProductQuantity(product);
    localStorage.setItem("cart", JSON.stringify(myCart));
    popupContainerFill();
  });
  productWrap2.appendChild(productLess);
  productWrap2.appendChild(productQuantity);
  productWrap2.appendChild(productMore);
  
  
//+-
      

      productDelete.addEventListener("click", () => {
        myCart.removeProduct(product);
        localStorage.setItem("cart", JSON.stringify(myCart));
        popupContainerFill();
      });
  
      productWrap1.appendChild(productImage);
      productWrap1.appendChild(productTitle);
      productWrap2.appendChild(productPrice);
      productWrap2.appendChild(productDelete);
      
      productItem.appendChild(productWrap1);
      productItem.appendChild(productWrap2);
  
      return productItem;
    });
  
    productsHTML.forEach((productHTML) => {
      popupProductList.appendChild(productHTML);
    });
  
    popupCost.value = toCurrency(myCart.cost);
    popupDiscount.value = toCurrency(myCart.discount);
    popupCostDiscount.value = toCurrency(myCart.costDiscount);
  }
  
  popupClose.addEventListener("click", (e) => {
    e.preventDefault();
    popup.classList.remove("popup--open");
    body.classList.remove("lock");
  });