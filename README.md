# Blog System

## 簡介
本專案是一個簡單的 Blog 系統，允許用戶註冊、發佈文章、留言評論，並支援分類與標籤功能。

## 功能
- 使用者註冊/登入
- 文章管理（新增、編輯、刪除）
- 文章封面圖片
- 文章分類與標籤
- 留言評論功能
- 文章閱讀次數統計

## 資料庫設計
### 主要資料表

#### 1. `users` (使用者表)
| 欄位        | 類型      | 說明         |
|-------------|----------|--------------|
| `id`       | VARCHAR(36) | 使用者ID (UUID) |
| `username` | VARCHAR(255) | 使用者名稱 (唯一) |
| `password` | VARCHAR(255) | 加密密碼 |
| `email`    | VARCHAR(255) | 電子郵件 (唯一) |
| `role`     | ENUM(`admin`, `author`, `reader`) | 使用者角色 |
| `created_at` | TIMESTAMP | 註冊時間 |
| `last_login` | TIMESTAMP | 最後登入時間 |

#### 2. `posts` (文章表)
| 欄位        | 類型      | 說明         |
|-------------|----------|--------------|
| `id`       | VARCHAR(36) | 文章ID (UUID) |
| `user_id`  | VARCHAR(36) | 作者ID (關聯 users) |
| `title`    | VARCHAR(255) | 文章標題 |
| `content`  | TEXT        | 文章內容 |
| `summary`  | TEXT        | 文章摘要 |
| `category_id` | VARCHAR(36) | 文章分類 (關聯 categories) |
| `cover_image` | VARCHAR(255) | 文章封面圖片網址 |
| `status`   | ENUM(`public`, `draft`, `pending`) | 文章狀態 |
| `views`    | INT         | 瀏覽次數 |
| `created_at` | TIMESTAMP | 建立時間 |
| `updated_at` | TIMESTAMP | 更新時間 |

#### 3. `comments` (評論表)
| 欄位        | 類型      | 說明         |
|-------------|----------|--------------|
| `id`       | VARCHAR(36) | 評論ID (UUID) |
| `post_id`  | VARCHAR(36) | 所屬文章ID (關聯 posts) |
| `user_id`  | VARCHAR(36) | 評論者ID (關聯 users) |
| `content`  | TEXT        | 評論內容 |
| `parent_id` | VARCHAR(36) | 父評論ID (可為NULL) |
| `created_at` | TIMESTAMP | 評論時間 |

#### 4. `categories` (分類表)
| 欄位        | 類型      | 說明         |
|-------------|----------|--------------|
| `id`       | VARCHAR(36) | 分類ID (UUID) |
| `name`     | VARCHAR(255) | 分類名稱 |
| `description` | TEXT | 分類描述 |

#### 5. `tags` (標籤表)
| 欄位        | 類型      | 說明         |
|-------------|----------|--------------|
| `id`       | VARCHAR(36) | 標籤ID (UUID) |
| `name`     | VARCHAR(255) | 標籤名稱 |

#### 6. `post_tags` (文章-標籤關聯表)
| 欄位        | 類型      | 說明         |
|-------------|----------|--------------|
| `post_id`  | VARCHAR(36) | 文章ID (關聯 posts) |
| `tag_id`   | VARCHAR(36) | 標籤ID (關聯 tags) |

## 環境需求
- **MySQL 8.0+**
- **Node.js 16+** (如果是使用 Node.js 實作 API)
- **Docker (可選)**

## 安裝與使用
1. **Clone 專案**
```bash
git clone https://github.com/your-repo/blog-system.git
cd blog-system
```

2. **安裝相依套件**
```bash
npm install  # 如果是使用 Node.js
```

3. **設置環境變數**
```bash
cp .env.example .env  # 修改 .env 設定資料庫連線資訊
```

4. **啟動專案**
```bash
npm start  # 如果是使用 Node.js
```

## API 路由 (部分範例)
| 方法  | 路徑              | 說明 |
|------|-----------------|-----|
| `GET` | `/posts` | 獲取所有文章 |
| `GET` | `/posts/:id` | 獲取單篇文章 |
| `POST` | `/posts` | 新增文章 |
| `PUT` | `/posts/:id` | 更新文章 |
| `DELETE` | `/posts/:id` | 刪除文章 |

## License
MIT License

