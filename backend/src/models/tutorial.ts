import { query } from '@database/db';
import { v4 as uuidv4 } from 'uuid';

// Tutorials
export async function createTutorial(tutorial: any) {
  const id = uuidv4();

  const result = await query(
    `INSERT INTO tutorials (id, title, slug, description, content, category, difficulty_level, author_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [id, tutorial.title, tutorial.slug, tutorial.description, tutorial.content, tutorial.category, tutorial.difficulty_level, tutorial.author_id]
  );

  return result.rows[0];
}

export async function getTutorialById(id: string) {
  const result = await query('SELECT * FROM tutorials WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getTutorialBySlug(slug: string) {
  const result = await query('SELECT * FROM tutorials WHERE slug = $1', [slug]);
  return result.rows[0] || null;
}

export async function getTutorialsByCategory(category: string, page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const result = await query(
    `SELECT * FROM tutorials WHERE category = $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [category, limit, offset]
  );

  const countResult = await query('SELECT COUNT(*) FROM tutorials WHERE category = $1', [category]);
  const total = parseInt(countResult.rows[0].count);

  return {
    tutorials: result.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getAllTutorials(page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const result = await query(
    `SELECT * FROM tutorials
     ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const countResult = await query('SELECT COUNT(*) FROM tutorials');
  const total = parseInt(countResult.rows[0].count);

  return {
    tutorials: result.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function updateTutorial(id: string, updates: Record<string, any>) {
  const keys = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const result = await query(
    `UPDATE tutorials SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
}

// Tutorial Playlists
export async function createPlaylist(playlist: any) {
  const id = uuidv4();

  const result = await query(
    `INSERT INTO tutorial_playlists (id, title, slug, description, cover_image_url, created_by_id, is_published)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [id, playlist.title, playlist.slug, playlist.description, playlist.cover_image_url, playlist.created_by_id, playlist.is_published]
  );

  return result.rows[0];
}

export async function getPlaylistById(id: string) {
  const result = await query('SELECT * FROM tutorial_playlists WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getPlaylistBySlug(slug: string) {
  const result = await query('SELECT * FROM tutorial_playlists WHERE slug = $1', [slug]);
  return result.rows[0] || null;
}

export async function getPublishedPlaylists(page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const result = await query(
    `SELECT * FROM tutorial_playlists WHERE is_published = true
     ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const countResult = await query('SELECT COUNT(*) FROM tutorial_playlists WHERE is_published = true');
  const total = parseInt(countResult.rows[0].count);

  return {
    playlists: result.rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function updatePlaylist(id: string, updates: Record<string, any>) {
  const keys = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const result = await query(
    `UPDATE tutorial_playlists SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
}

// Playlist Items
export async function addPlaylistItem(playlistItem: any) {
  const id = uuidv4();

  const result = await query(
    `INSERT INTO playlist_items (id, playlist_id, tutorial_id, video_url, video_title, video_duration_seconds, description, sequence_order, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      id,
      playlistItem.playlist_id,
      playlistItem.tutorial_id,
      playlistItem.video_url,
      playlistItem.video_title,
      playlistItem.video_duration_seconds,
      playlistItem.description,
      playlistItem.sequence_order,
      playlistItem.source,
    ]
  );

  return result.rows[0];
}

export async function getPlaylistItems(playlistId: string) {
  const result = await query(
    `SELECT * FROM playlist_items WHERE playlist_id = $1
     ORDER BY sequence_order ASC`,
    [playlistId]
  );

  return result.rows;
}

export async function updatePlaylistItem(id: string, updates: Record<string, any>) {
  const keys = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

  const result = await query(
    `UPDATE playlist_items SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
}

export async function removePlaylistItem(id: string) {
  await query('DELETE FROM playlist_items WHERE id = $1', [id]);
}

// Product-Tutorial Links
export async function linkProductToTutorial(productId: string, tutorialId: string) {
  await query(
    `INSERT INTO product_tutorials (product_id, tutorial_id)
     VALUES ($1, $2)
     ON CONFLICT (product_id, tutorial_id) DO NOTHING`,
    [productId, tutorialId]
  );
}

export async function getTutorialsForProduct(productId: string) {
  const result = await query(
    `SELECT t.* FROM tutorials t
     JOIN product_tutorials pt ON t.id = pt.tutorial_id
     WHERE pt.product_id = $1`,
    [productId]
  );

  return result.rows;
}
