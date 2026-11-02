import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../api', () => ({
  cartApi: {
    get: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  },
}));

import { useCartStore } from './cartStore';
import { cartApi } from '../api';

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], totalItems: 0, subtotal: 0, restaurant: null, isOpen: false, loading: false });
  });

  it('calculates item count and subtotal after an item is added', async () => {
    cartApi.add.mockResolvedValue({ data: { data: { cart: {
      items: [
        { food: 'food-1', quantity: 2, price: 120 },
        { food: 'food-2', quantity: 1, price: 80 },
      ],
      restaurant: null,
    } } } });

    await useCartStore.getState().addItem('food-1', 2, 120);

    expect(useCartStore.getState().items).toHaveLength(2);
    expect(useCartStore.getState().totalItems).toBe(3);
    expect(useCartStore.getState().subtotal).toBe(320);
  });

  it('calculates totals for manually hydrated cart state', () => {
    useCartStore.setState({
      items: [{ food: 'food-1', quantity: 1, price: 120 }],
      totalItems: 1,
      subtotal: 120,
    });

    expect(useCartStore.getState().totalItems).toBe(1);
    expect(useCartStore.getState().subtotal).toBe(120);
  });

  it('toggles the cart drawer', () => {
    useCartStore.getState().toggleCart();
    expect(useCartStore.getState().isOpen).toBe(true);
    useCartStore.getState().toggleCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });
});
