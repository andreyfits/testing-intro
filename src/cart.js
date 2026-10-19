const PROMO_CODE = 'SAVE10';
const PROMO_DISCOUNT_PERCENT = 10;
const PROMO_MIN_SUBTOTAL = 20000;
const FREE_DELIVERY_MIN_SUBTOTAL = 50000;
const DELIVERY_COST = 30000;

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

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
}

function isKnownPromoCode(promoCode) {
  return typeof promoCode === 'string' && promoCode.trim().toUpperCase() === PROMO_CODE;
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);
  const isDiscountApplied = isKnownPromoCode(promoCode) && subtotal >= PROMO_MIN_SUBTOTAL;
  const discount = isDiscountApplied ? Math.round((subtotal * PROMO_DISCOUNT_PERCENT) / 100) : 0;
  const delivery = subtotal < FREE_DELIVERY_MIN_SUBTOTAL ? DELIVERY_COST : 0;

  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
