import { query } from '@database/db';
import { v4 as uuidv4 } from 'uuid';

// Products
export async function createProduct(product: any) {
  const id = uuidv4();

  const result = await query(
    `INSERT INTO products (id, sku, name, slug, description, category_id, price, cost, stock_quantity, low_stock_threshold, weight_kg, dimensions_cm, image_url, gallery_urls, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING *`,
    [
      id,
      product.sku,
      product.name,
      product.slug,
      product.description,
      product.category_id,
      product.price,
      product.cost,
      product.stock_quantity,
      product.low_stock_threshold,
      product.weight_kg,
      product.dimensions_cm,
      product.image_url,
      product.gallery_urls,
      product.is_active,
    ]
  );

  return result.rows[0];
}

export async function getProductById(id: string) {
  const result = await query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getProductBySlug(slug: string) {
  const result = await query('SELECT * FROM products WHERE slug = $1', [slug]);
  return result.rows[0] || null;
}

export async function getProductsByCategoryId(categoryId: string, page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const result = await query(
    `SELECT * FROM products WHERE category_id = $1 AND is_active = true
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [categoryId, limit, offset]
  );

  const countResult = await query(
    'SELECT COUNT(*) FROM products WHERE category_id = $1 AND is_active = true',
    [categoryId]
  );
  const total = parseInt(countResult.rows[0].count);

  return {
    products: result.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getAllProducts(page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const result = await query(
    `SELECT * FROM products WHERE is_active = true
     ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const countResult = await query('SELECT COUNT(*) FROM products WHERE is_active = true');
  const total = parseInt(countResult.rows[0].count);

  return {
    products: result.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function updateProduct(id: string, updates: Record<string, any>) {
  const keys = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const result = await query(
    `UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
}

export async function deleteProduct(id: string) {
  await query('DELETE FROM products WHERE id = $1', [id]);
}

// Product Categories
export async function createCategory(category: any) {
  const id = uuidv4();

  const result = await query(
    `INSERT INTO product_categories (id, name, slug, description, parent_category_id, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [id, category.name, category.slug, category.description, category.parent_category_id, category.is_active]
  );

  return result.rows[0];
}

export async function getAllCategories() {
  const result = await query('SELECT * FROM product_categories WHERE is_active = true ORDER BY name');
  return result.rows;
}

export async function getCategoryById(id: string) {
  const result = await query('SELECT * FROM product_categories WHERE id = $1', [id]);
  return result.rows[0] || null;
}

// Product Specs
export async function addProductSpec(productId: string, specName: string, specValue: string) {
  const id = uuidv4();

  const result = await query(
    `INSERT INTO product_specs (id, product_id, spec_name, spec_value)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, productId, specName, specValue]
  );

  return result.rows[0];
}

export async function getProductSpecs(productId: string) {
  const result = await query('SELECT * FROM product_specs WHERE product_id = $1', [productId]);
  return result.rows;
}

export async function searchProducts(searchTerm: string, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const term = `%${searchTerm}%`;

  const result = await query(
    `SELECT * FROM products
     WHERE is_active = true AND (name ILIKE $1 OR description ILIKE $1 OR sku ILIKE $1)
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [term, limit, offset]
  );

  const countResult = await query(
    `SELECT COUNT(*) FROM products
     WHERE is_active = true AND (name ILIKE $1 OR description ILIKE $1 OR sku ILIKE $1)`,
    [term]
  );
  const total = parseInt(countResult.rows[0].count);

  return {
    products: result.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}
