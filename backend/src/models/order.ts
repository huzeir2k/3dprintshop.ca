import { query } from '@database/db';
import { v4 as uuidv4 } from 'uuid';

// Cart
export async function addToCart(userId: string, productId: string, quantity: number) {
  const id = uuidv4();

  const result = await query(
    `INSERT INTO cart_items (id, user_id, product_id, quantity)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = quantity + $4
     RETURNING *`,
    [id, userId, productId, quantity]
  );

  return result.rows[0];
}

export async function getCart(userId: string) {
  const result = await query(
    `SELECT ci.*, p.name, p.price, p.image_url FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = $1
     ORDER BY ci.added_at DESC`,
    [userId]
  );

  return result.rows;
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  const result = await query('UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *', [
    quantity,
    cartItemId,
  ]);

  return result.rows[0];
}

export async function removeFromCart(cartItemId: string) {
  await query('DELETE FROM cart_items WHERE id = $1', [cartItemId]);
}

export async function clearCart(userId: string) {
  await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
}

// Orders
export async function createOrder(order: any) {
  const id = uuidv4();

  const result = await query(
    `INSERT INTO orders (id, order_number, user_id, status, subtotal, tax, shipping_cost, total, shipping_address_id, billing_address_id, payment_method, stripe_payment_intent_id, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
    [
      id,
      order.order_number,
      order.user_id,
      order.status,
      order.subtotal,
      order.tax,
      order.shipping_cost,
      order.total,
      order.shipping_address_id,
      order.billing_address_id,
      order.payment_method,
      order.stripe_payment_intent_id,
      order.notes,
    ]
  );

  return result.rows[0];
}

export async function getOrderById(id: string) {
  const result = await query('SELECT * FROM orders WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getOrderByNumber(orderNumber: string) {
  const result = await query('SELECT * FROM orders WHERE order_number = $1', [orderNumber]);
  return result.rows[0] || null;
}

export async function getUserOrders(userId: string, page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const result = await query(
    `SELECT * FROM orders WHERE user_id = $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  const countResult = await query('SELECT COUNT(*) FROM orders WHERE user_id = $1', [userId]);
  const total = parseInt(countResult.rows[0].count);

  return {
    orders: result.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function updateOrderStatus(id: string, status: string) {
  const result = await query(
    'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [status, id]
  );

  return result.rows[0];
}

// Order Items
export async function createOrderItem(orderItem: any) {
  const id = uuidv4();

  const result = await query(
    `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [id, orderItem.order_id, orderItem.product_id, orderItem.quantity, orderItem.unit_price, orderItem.subtotal]
  );

  return result.rows[0];
}

export async function getOrderItems(orderId: string) {
  const result = await query(
    `SELECT oi.*, p.name, p.image_url FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  return result.rows;
}
