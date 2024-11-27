// Selecting Cart Elements
const btnCart = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const btnClose = document.querySelector('#cart-close');
const cartCount = document.querySelector('.cart-count');
let itemList = JSON.parse(localStorage.getItem('cartItems')) || [];

// Toggle Cart Sidebar on Cart Icon Click
btnCart.addEventListener('click', () => {
  cart.classList.add('cart-active');
});

// Close Cart Sidebar on Close Icon Click
btnClose.addEventListener('click', () => {
  cart.classList.remove('cart-active');
});

// Initialize Event Listeners on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  loadCartItems(); // Load products dynamically if needed
  displayCartItems(); // Display items from localStorage
  updateTotal(); // Update total price and cart count in navbar
  window.addEventListener('storage', syncCartAcrossTabs); // Sync cart changes across tabs
});

// Add Event Listeners for Add to Cart Buttons
function loadCartItems() {
  const cartBtns = document.querySelectorAll('.add-cart');
  cartBtns.forEach(btn => {
    btn.addEventListener('click', addCartItem);
  });
}

// Add Product to Cart
function addCartItem() {
  const plant = this.parentElement;
  const title = plant.querySelector('.plant-title').innerText;
  const price = plant.querySelector('.plant-price').innerText;
  const imgSrc = plant.querySelector('.plant-img').src;

  // Check if Item is Already in Cart
  const existingItem = itemList.find(item => item.title === title);
  if (existingItem) {
    alert("Product already added to Cart");
    return;
  }

  // Add New Product
  const newProduct = { title, price, imgSrc, quantity: 1 };
  itemList.push(newProduct);
  updateCart();
  showAddToCartMessage(title); // Display message with the item title
}

// Display Cart Items from itemList Array
function displayCartItems() {
  const cartBasket = document.querySelector('.cart-content');
  cartBasket.innerHTML = ''; // Clear existing items

  itemList.forEach(item => {
    const cartItemElement = createCartItem(item);
    cartBasket.appendChild(cartItemElement);
  });
}

// Create HTML for a Cart Item
function createCartItem(item) {
  const element = document.createElement('div');
  element.classList.add('cart-box');
  element.innerHTML = `
    <img src="${item.imgSrc}" class="cart-img">
    <div class="detail-box">
      <div class="cart-plant-title">${item.title}</div>
      <div class="price-box">
        <div class="cart-price">${item.price}</div>
        <div class="cart-amt">Rs.${(parseFloat(item.price.replace("Rs.", "")) * item.quantity).toFixed(2)}</div>
      </div>
      <input type="number" value="${item.quantity}" class="cart-quantity" min="1">
    </div>
    <ion-icon name="trash" class="cart-remove"></ion-icon>
  `;

  // Add Event Listeners for Remove and Quantity Change
  element.querySelector('.cart-remove').addEventListener('click', () => removeItem(item.title));
  element.querySelector('.cart-quantity').addEventListener('change', (event) => changeQuantity(event, item.title));

  return element;
}

// Remove Item from Cart
function removeItem(title) {
  if (confirm('Are you sure you want to remove this item?')) {
    itemList = itemList.filter(item => item.title !== title);
    updateCart();
  }
}

// Change Quantity of a Cart Item
function changeQuantity(event, title) {
  const newQuantity = parseInt(event.target.value, 10);
  const item = itemList.find(item => item.title === title);

  if (item) {
    item.quantity = newQuantity > 0 ? newQuantity : 1; // Ensure quantity is at least 1
    updateCart();
  }
}

// Show "Added to Cart" Message with Specific Product Name
function showAddToCartMessage(title) {
  const messageBox = document.createElement('div');
  messageBox.className = 'cart-message';
  messageBox.innerText = `${title} has been added to your cart!`;
  document.body.appendChild(messageBox);

  // Styling for the message box
  messageBox.style.position = 'fixed';
  messageBox.style.bottom = '20px';
  messageBox.style.right = '20px';
  messageBox.style.padding = '10px';
  messageBox.style.backgroundColor = 'red';
  messageBox.style.color = '#fff';
  messageBox.style.borderRadius = '5px';
  messageBox.style.zIndex = '1000';

  // Remove message after 2 seconds
  setTimeout(() => {
    messageBox.remove();
  }, 2000);
}

// Update Cart Display, Total Price, and Local Storage
function updateCart() {
  displayCartItems();
  updateTotal();
  localStorage.setItem('cartItems', JSON.stringify(itemList));
}

// Update Total Price and Cart Count
function updateTotal() {
  const totalValue = document.querySelector('.total-price');
  let total = 0;
  let itemCount = 0;

  itemList.forEach(item => {
    const price = parseFloat(item.price.replace("Rs.", ""));
    const itemTotal = price * item.quantity;
    total += itemTotal;
    itemCount += item.quantity;
  });

  totalValue.innerText = 'Rs.' + total.toFixed(2);
  cartCount.innerText = itemCount;
  cartCount.style.display = itemCount > 0 ? 'block' : 'none';
}

// Sync Cart Across Tabs and Windows
function syncCartAcrossTabs(event) {
  if (event.key === 'cartUpdated' || event.key === 'cartItems') {
    itemList = JSON.parse(localStorage.getItem('cartItems')) || [];
    displayCartItems();
    updateTotal();
  }
}
