import { query } from '@database/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function createUser(email: string, password: string, first_name?: string, last_name?: string) {
  const id = uuidv4();
  const password_hash = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (id, email, password_hash, first_name, last_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id, email, password_hash, first_name || null, last_name || null]
  );

  return result.rows[0];
}

export async function getUserById(id: string) {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getUserByEmail(email: string) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function updateUser(id: string, updates: Record<string, any>) {
  const { password_hash, ...safeUpdates } = updates;
  const keys = Object.keys(safeUpdates);
  const values = Object.values(safeUpdates);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const result = await query(
    `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
}

export async function verifyPassword(stored_hash: string, password: string) {
  return bcrypt.compare(password, stored_hash);
}

export async function getAllUsers(page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const result = await query(
    `SELECT id, email, first_name, last_name, role, is_active, created_at FROM users
     ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const countResult = await query('SELECT COUNT(*) FROM users');
  const total = parseInt(countResult.rows[0].count);

  return {
    users: result.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}
