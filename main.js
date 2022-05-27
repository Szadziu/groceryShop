'use strict';

import { fruits, letters } from './data.js';
import { createElement, getElementByClass } from './helpers.js';

const selectByLetters = getElementByClass('.stock__select--letters');
const selectByAlphabet = getElementByClass('.stock__select--alphabet');

const findButton = getElementByClass('.button--find');
const orderButton = getElementByClass('.button--order');

const stockAssortment = getElementByClass('.stock__list');

document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('add-to-cart-button')) {
    addToCart(event.target.getAttribute('data-item'));
  } else if (event.target.classList.contains('remove-from-cart-button')) {
    removeFromCart(event.target.getAttribute('data-item'));
  } else if (event.target.classList.contains('add-button')) {
    changeQuantity(event.target.getAttribute('data-item'), -1);
  } else if (event.target.classList.contains('subtract-button')) {
    changeQuantity(event.target.getAttribute('data-item'), 1);
  }
});

findButton.addEventListener('click', searchByLetters);
orderButton.addEventListener('click', searchByAlphabet);

letters.forEach((letter) => {
  const option = createElement('option');
  option.value = letter;
  option.textContent = letter;
  selectByLetters.appendChild(option);
});

let cart = new Map();

function searchByLetters() {
  const stockListEmptyModal = getElementByClass('.stock__list--empty');
  const filteredFruits = fruits.filter(
    (fruit) => fruit.toLowerCase()[0] === selectByLetters.value.toLowerCase()
  );
  renderCurrentAssortment(filteredFruits);
  if (filteredFruits.length === 0) {
    stockListEmptyModal.style.display = 'block';
  }
}

function searchByAlphabet() {
  const copy = [...fruits].sort((a, b) => {
    if (selectByAlphabet.value == 0) {
      if (a > b) {
        return -1;
      }
      if (b < a) {
        return 1;
      }
    }

    if (selectByAlphabet.value == 1) {
      if (a < b) {
        return -1;
      }
      if (b > a) {
        return 1;
      }
    }
    return 0;
  });

  renderCurrentAssortment(copy);
}

function renderCurrentAssortment(assortment) {
  stockAssortment.textContent = '';

  for (const [i, fruit] of assortment.entries()) {
    const product = createElement('li', 'stock__item');
    const addToCartButton = createElement('button', [
      'button',
      'add-to-cart-button',
    ]);
    addToCartButton.setAttribute('data-item', fruit);

    product.textContent = `${i + 1}. ${fruit[0].toUpperCase()}${fruit.slice(
      1,
      fruit.length
    )} ${(getFruitPrice(fruit) / 100).toFixed(2)} zł`;
    addToCartButton.textContent = 'Dodaj do koszyka';

    stockAssortment.appendChild(product);
    product.appendChild(addToCartButton);
  }
}

function renderCurrentCart(cart) {
  const shopCart = getElementByClass('.stock__cart-list');
  const emptyCartModal = getElementByClass('.stock__cart--empty');
  const cartTotalResult = getElementByClass('.stock__cart-summary--embolden');

  let counter = 1;
  let cartTotalPrice = 0;

  shopCart.textContent = '';

  for (const [item, amount] of cart) {
    const itemPrice = (getFruitPrice(item) / 100).toFixed(2);
    const itemTotalPrice = itemPrice * amount;

    const product = createElement('tr', 'cart__item');

    product.innerHTML = `
        <p class="cart__item">
        <span> ${counter}. </span>
        <span> ${item[0].toUpperCase()}${item.slice(1, item.length)} </span>
        <span> ${itemPrice} zł </span>
        <span>
          <button class="button subtract-button" data-item="${item}">-</button>
          ${amount}
          <button class="button add-button" data-item="${item}">+</button>
        </span>
        <span>${itemTotalPrice.toFixed(2)} zł</span>
        <span> 
          <button class="button remove-from-cart-button" data-item="${item}">Usuń z koszyka</button>
        </span>
        </p>
        `;

    shopCart.appendChild(product);
    counter++;
    cartTotalPrice += itemTotalPrice;
  }

  if (cart.size > 0) {
    emptyCartModal.style.display = 'none';
  } else {
    emptyCartModal.style.display = 'block';
  }

  cartTotalResult.textContent = `${cartTotalPrice.toFixed(2)} zł`;
}

function getFruitPrice(fruitName) {
  if (fruitName[0].toLowerCase() === 'a') {
    return 350;
  }

  if (fruitName[0].toLowerCase() === 'm') {
    return 480;
  }

  if (fruitName[0].toLowerCase() === 'k') {
    return 2000;
  }
  return 200;
}

function addToCart(fruitName) {
  if (cart.has(fruitName)) {
    cart.set(fruitName, cart.get(fruitName) + 1);
  } else {
    cart.set(fruitName, 1);
  }
  renderCurrentCart(cart);
}

function changeQuantity(fruitName, newQuantity) {
  if (cart.has(fruitName)) {
    if (cart.get(fruitName) >= 1 && cart.get(fruitName) <= 500) {
      cart.set(fruitName, cart.get(fruitName) - newQuantity);
      renderCurrentCart(cart);
    }
    if (cart.get(fruitName) === 0) {
      removeFromCart(fruitName);
    }
  } else {
    console.log('nie ma takiego owocu');
  }
}

function removeFromCart(fruitName) {
  if (cart.has(fruitName)) {
    cart.delete(fruitName);
    renderCurrentCart(cart);
  }
}
