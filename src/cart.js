function notImplemented() {
  throw new Error('Корзина ещё не реализована. Сначала прочитайте тесты.');
}

function assertPositiveInteger(quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError('Количество должно быть целым числом больше нуля.');
  }
}

function assertInStock(quantity, stock) {
  if (quantity > stock) {
    throw new RangeError(`Недостаточно товара на складе: доступно ${stock} шт.`);
  }
}

function setItemQuantity(cart, productId, quantity) {
  return cart.map((item) => (item.id === productId ? { ...item, quantity } : item));
}

function addToCart(cart, product, quantity = 1) {
  assertPositiveInteger(quantity);
  const item = cart.find(({ id }) => id === product.id);
  const nextQuantity = (item ? item.quantity : 0) + quantity;
  assertInStock(nextQuantity, product.stock);

  if (!item) return [...cart, { ...product, quantity }];
  return setItemQuantity(cart, product.id, nextQuantity);
}

function changeQuantity(cart, productId, quantity) {
  const item = cart.find(({ id }) => id === productId);
  if (!item) return [...cart];

  assertPositiveInteger(quantity);
  assertInStock(quantity, item.stock);
  return setItemQuantity(cart, productId, quantity);
}

function removeFromCart(cart, productId) {
  return cart.filter(({ id }) => id !== productId);
}

function calculateCartSubtotal() { return notImplemented(); }
function calculateOrderTotal() { return notImplemented(); }

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
