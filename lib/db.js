import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Database Initialization
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create users table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(10) CHECK (role IN ('admin', 'author', 'reader')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    // Create user_profiles table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255),
        avatar_url TEXT,
        bio TEXT,
        website VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create categories table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
      )
    `);

    // Create posts table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        category_id VARCHAR(36),
        cover_image VARCHAR(255),
        status VARCHAR(10) CHECK (status IN ('public', 'draft', 'pending')),
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    // Create tags table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS tags (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    // Create post_tags table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS post_tags (
        post_id VARCHAR(36) NOT NULL,
        tag_id VARCHAR(36) NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      )
    `);

    // Create comments table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(36) PRIMARY KEY,
        post_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        content TEXT NOT NULL,
        parent_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
      )
    `);

    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Check if tables exist
export async function checkTables() {
  try {
    const tables = ['users', 'user_profiles', 'categories', 'posts', 'tags', 'post_tags', 'comments'];
    const results = {};

    for (const table of tables) {
      try {
        await client.execute(`SELECT 1 FROM ${table} LIMIT 1`);
        results[table] = true;
      } catch (error) {
        results[table] = false;
      }
    }

    return results;
  } catch (error) {
    console.error('Failed to check tables:', error);
    throw error;
  }
}

// Posts CRUD Operations
export async function getAllPosts({ page = 1, limit = 10, status = 'public' } = {}) {
  const offset = (page - 1) * limit;
  
  const { rows } = await client.execute({
    sql: `
      SELECT 
        p.id, p.user_id, p.title, p.content, p.summary,
        p.category_id, p.cover_image, p.status, p.views,
        p.created_at, p.updated_at,
        u.username as author_name,
        c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `,
    args: [status, limit, offset]
  });
  return rows;
}

export async function getPostsCount(status = 'public') {
  const { rows } = await client.execute({
    sql: 'SELECT COUNT(*) as total FROM posts WHERE status = ?',
    args: [status]
  });
  return rows[0].total;
}

export async function getPostById(id) {
  const { rows } = await client.execute({
    sql: `
      SELECT 
        p.*, 
        u.username as author_name,
        c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `,
    args: [id]
  });
  return rows[0];
}

export async function createPost({ user_id, title, content, summary, category_id, cover_image, status = 'draft' }) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await client.execute({
    sql: `
      INSERT INTO posts (
        id, user_id, title, content, summary,
        category_id, cover_image, status, views,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `,
    args: [id, user_id, title, content, summary, category_id, cover_image, status, now, now]
  });

  return getPostById(id);
}

export async function updatePost(id, { title, content, summary, category_id, cover_image, status }) {
  const now = new Date().toISOString();
  
  await client.execute({
    sql: `
      UPDATE posts 
      SET 
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        summary = COALESCE(?, summary),
        category_id = COALESCE(?, category_id),
        cover_image = COALESCE(?, cover_image),
        status = COALESCE(?, status),
        updated_at = ?
      WHERE id = ?
    `,
    args: [title, content, summary, category_id, cover_image, status, now, id]
  });

  return getPostById(id);
}

export async function deletePost(id) {
  // First delete related records in post_tags
  await client.execute({
    sql: 'DELETE FROM post_tags WHERE post_id = ?',
    args: [id]
  });

  // Then delete the post
  await client.execute({
    sql: 'DELETE FROM posts WHERE id = ?',
    args: [id]
  });

  return true;
}

// Post Tags Operations
export async function addPostTags(post_id, tag_ids) {
  const values = tag_ids.map(tag_id => `('${post_id}', '${tag_id}')`).join(',');
  await client.execute(`
    INSERT INTO post_tags (post_id, tag_id) VALUES ${values}
  `);
}

export async function getPostTags(post_id) {
  const { rows } = await client.execute({
    sql: `
      SELECT t.* 
      FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `,
    args: [post_id]
  });
  return rows;
}

// View Count Update
export async function incrementPostViews(id) {
  await client.execute({
    sql: 'UPDATE posts SET views = views + 1 WHERE id = ?',
    args: [id]
  });
}

// User Operations
export async function getUserByEmail(email) {
  const { rows } = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });
  return rows[0] || null;
}

export async function getUserById(id) {
  const { rows } = await client.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [id]
  });
  return rows[0] || null;
}

export async function createUser({ id, name, email, image, role = 'reader' }) {
  const now = new Date().toISOString();
  
  // 創建默認用戶名（從郵箱獲取）
  const username = email.split('@')[0] + '_' + Math.floor(Math.random() * 1000);
  
  try {
    await client.execute({
      sql: `
        INSERT INTO users (
          id, username, email, password, role, created_at, last_login
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [id, username, email, 'oauth_user', role, now, now]
    });
    
    // 創建用戶配置文件
    await client.execute({
      sql: `
        INSERT INTO user_profiles (
          user_id, name, avatar_url, updated_at
        ) VALUES (?, ?, ?, ?)
      `,
      args: [id, name, image, now]
    });
    
    return getUserById(id);
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

export async function updateUserLastLogin(id) {
  const now = new Date().toISOString();
  await client.execute({
    sql: 'UPDATE users SET last_login = ? WHERE id = ?',
    args: [now, id]
  });
}

export async function updateUserRole(id, role) {
  if (!['admin', 'author', 'reader'].includes(role)) {
    throw new Error('Invalid role specified');
  }
  
  await client.execute({
    sql: 'UPDATE users SET role = ? WHERE id = ?',
    args: [role, id]
  });
  
  return getUserById(id);
}
