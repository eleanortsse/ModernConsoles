  const notificationNum = document.querySelector("#notif_num");
  const notification = document.querySelector("#notification");
  
  class Bell {
    notifications;
    constructor() {
      this.notifications = [];
    }
    get count() {
      return this.notifications.length;
    }
    addProduct(newN) {
      this.notifications.push(product);
    }
    removeProduct(index) {
      this.notifications.splice(index, 1);
    }
  }
  
  class newN {
    title;
    data;
    constructor() {}
  }
  
  const myBell = new Bell();
  
  // Попап
  
  const popup = document.querySelector(".popup");
  const popupClose = document.querySelector("#popup_close");
  const body = document.body;
  const popupContainer = document.querySelector("#popup_container");
  
  notification.addEventListener("click", (e) => {
    e.preventDefault();
    popup.classList.add("popup--open");
    body.classList.add("lock");
  });
  
  popupClose.addEventListener("click", (e) => {
    e.preventDefault();
    popup.classList.remove("popup--open");
    body.classList.remove("lock");
  });