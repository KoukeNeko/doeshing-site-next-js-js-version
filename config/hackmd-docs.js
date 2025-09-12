// HackMD 文件配置
export const hackmdConfig = {
  // 文件列表
  documents: [
    // 暫時移除範例文件，避免載入錯誤
    // 請使用管理頁面的「測試單一筆記」功能來測試你的筆記
    // 然後將生成的配置貼到這裡
    
    // {
    //   id: "your-note-id", // 請替換為實際的 HackMD Note ID
    //   title: "你的文件標題",
    //   description: "文件描述",
    //   category: "技術",
    //   tags: ["標籤1", "標籤2"],
    //   featured: true
    // },
    // KoukeNeko 使用者的文件範例格式：
    // {
    //   id: "@KoukeNeko/your-note-shortid", // 使用 @username/shortid 格式
    //   title: "我的技術文件",
    //   description: "文件描述",
    //   category: "技術",
    //   tags: ["標籤1", "標籤2"],
    //   featured: false
    // },
    // 或直接使用 shortid（如果文件是公開的）:
    // {
    //   id: "your-note-shortid",
    //   title: "公開文件",
    //   description: "公開文件描述",
    //   category: "分享",
    //   tags: ["公開", "分享"],
    //   featured: true
    // }
  ],


  // 顯示設定
  settings: {
    // 每頁顯示的文件數量
    itemsPerPage: 10,
    
    // 是否啟用搜尋功能
    enableSearch: true,
    
    
    // 是否啟用標籤篩選
    enableTagFilter: true,
    
    // 是否顯示精選文件區塊
    showFeatured: true,
    
    // 文件預設排序方式 (date, title)
    defaultSort: 'date',
    
    // 是否啟用快取（以分鐘為單位）
    cacheTime: 10
  }
};

// 取得所有文件配置
export function getAllDocuments() {
  return hackmdConfig.documents;
}


// 取得精選文件
export function getFeaturedDocuments() {
  return hackmdConfig.documents.filter(doc => doc.featured);
}

// 根據標籤篩選文件
export function getDocumentsByTag(tag) {
  return hackmdConfig.documents.filter(doc => doc.tags.includes(tag));
}

// 搜尋文件
export function searchDocuments(query) {
  const lowerQuery = query.toLowerCase();
  return hackmdConfig.documents.filter(doc => 
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.description.toLowerCase().includes(lowerQuery) ||
    doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}