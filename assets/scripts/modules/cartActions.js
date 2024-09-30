import { displayModalCartItem, displayCartItem } from "./createElements.js";
import {
  saveListToLocalStorage,
  loadListFromLocalStorage,
  removeItemLocalStore,
  updateQuantityProductToLocalStorage,
} from "./localStorage.js";
import { createWineFromDOM, buildProductFromCartItem } from "./wineBuilder.js";

function updateCartDisplayQuantity(quantity, elementId) {
  const cartQuantityElement = document.querySelector(`#${elementId}`);

  if (!cartQuantityElement) return;

  if (quantity > 0) {
    cartQuantityElement.classList.add("js-cart__actived");
    cartQuantityElement.textContent = quantity;
  } else {
    cartQuantityElement.classList.remove("js-cart__actived");
    cartQuantityElement.textContent = "";
  }
}

function toggleCartEmptyState(isEmpty) {
  const emptyMessage = document.querySelector(".cart__empty");
  const cart = document.querySelector(".cart__visible");

  if (!emptyMessage || !cart) return;

  emptyMessage.classList.toggle("cart__empty", isEmpty);
  emptyMessage.classList.toggle("cart__not-empty", !isEmpty);

  cart.classList.toggle("cart__visible", !isEmpty);
  cart.classList.toggle("cart__hidden", isEmpty);
}

export function displayModalProducts() {
  const wines = loadListFromLocalStorage();
  const cartList = document.querySelector("#cartModalList");

  if (!cartList) return;

  if (wines.length > 0) {
    updateCartDisplayQuantity(wines.length, "cartModalQuantity");

    wines.forEach((wine) => {
      const cartItem = displayModalCartItem(wine);
      cartList.appendChild(cartItem);
    });

    updateCartTotalDisplay("cartModalTotal");
    toggleCartEmptyState(false);
  } else {
    toggleCartEmptyState(true);
  }
}

export function displayProductsPage() {
  const wines = loadListFromLocalStorage();
  const cartList = document.querySelector("#cartListPage");

  if (!cartList) return;

  if (wines.length > 0) {
    wines.forEach((wine) => {
      const cartItem = displayCartItem(wine);
      cartList.appendChild(cartItem);
    });

    updateCartTotalDisplay("cartFinalPrice");
    toggleCartEmptyState(false);
  } else {
    toggleCartEmptyState(true);
  }
}

function calculateTotalCartValue() {
  const wines = loadListFromLocalStorage();

  return wines.reduce((total, wine) => total + wine.price * wine.quantity, 0);
}

function updateCartTotalDisplay(elementId) {
  const cartElement = document.querySelector(`#${elementId} strong`);

  if (!cartElement) return;

  const totalValue = calculateTotalCartValue();
  cartElement.textContent = `R$ ${totalValue.toFixed(2)}`;
}

export function handleAddWineToCart() {
  const buyButton = document.querySelector("#btn-buy");

  if (!buyButton) return;

  buyButton.addEventListener("click", () => {
    const wine = createWineFromDOM();
    saveListToLocalStorage(wine);
    alert("Produto Adicionar ao carrinho");
    window.location.reload();
  });
}

export function handleCartItemDeletion() {
  const removeButtons = document.querySelectorAll("[data-product-id]");
  const winesList = document.querySelectorAll(".js-product");

  if (!removeButtons || !winesList) return;

  const handleRemoveItem = (index) => {
    const item = winesList[index];

    if (item) {
      const itemId = item.getAttribute("id");
      removeItemLocalStore(itemId);
      item.remove();
      updateCartDisplayQuantity(winesList.length);
      updateCartTotalDisplay();
      alert("Produto removido do carrinho.");
      window.location.reload();
    }
  };

  removeButtons.forEach((link, index) => {
    link.addEventListener("click", () => handleRemoveItem(index));
  });
}

export function redirectPageCart() {
  const buttonRedirect = document.querySelector("#viewCart");

  if (!buttonRedirect) return;

  buttonRedirect.addEventListener("click", () => {
    window.location.href = "../pages/cart.html";
  });
}

function handleIncrement(event) {
  const itemId = event.currentTarget.dataset.incrementItem;
  const input = document.querySelector(`[data-quantity-input="${itemId}"]`);

  input.value = +input.value + 1;
}

export function increaseCartItem() {
  const increaseButtons = document.querySelectorAll("[data-increment-item]");

  increaseButtons.forEach((button) => {
    button.addEventListener("click", handleIncrement);
  });
}

function handleDecrement(event) {
  const itemId = event.currentTarget.dataset.decrementItem;
  const input = document.querySelector(`[data-quantity-input="${itemId}"]`);

  const currentValue = parseInt(input.value, 10);

  input.value = currentValue > 1 ? currentValue - 1 : 1;
}

export function decreaseCartItem() {
  const decreaseButtons = document.querySelectorAll("[data-decrement-item]");

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", handleDecrement);
  });
}

function handleCartUpdate() {
  const cartItens = document.querySelectorAll("#cartListPage li");
  const totalCartValue = document.querySelector("#cartFinalPrice strong");

  if (!cartItens || !totalCartValue) return;

  const products = new Set();

  cartItens.forEach((item) => {
    products.add(buildProductFromCartItem(item));
  });

  updateQuantityProductToLocalStorage(products);
  updateCartTotalDisplay(totalCartValue);
}

export function updateCartItemsInLocalStorage() {
  const cartUpdateButton = document.querySelector("#cartUpdateButton");

  if (!cartUpdateButton) return;

  cartUpdateButton.addEventListener("click", handleCartUpdate);
}
