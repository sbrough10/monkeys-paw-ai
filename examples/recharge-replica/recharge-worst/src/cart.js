import { CART_STORAGE_KEY, SERVICE_FEE_CZK } from './data/catalog.js';

export function readCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeCart(item) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(item));
}

export function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}

export function orderTotals(lineCzk, qty = 1) {
  const subtotal = lineCzk * qty;
  return {
    subtotal,
    serviceFee: SERVICE_FEE_CZK,
    total: subtotal + SERVICE_FEE_CZK,
  };
}
