"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TitleBar from "@/components/layout/TitleBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


import { 
  Calendar, 
  ExternalLink, 
  RefreshCw, 
  FileText, 
  Clock,
  User,
  Tag,
  Search,
  Filter,
  Settings
} from "lucide-react";
import { getAllDocuments } from "@/config/hackmd-docs";

export default function BlogPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState(null);

  // 取得配置的文件列表
  const configuredDocs = getAllDocuments();

  useEffect(() => {
    function checkScreenSize() {
      setIsMobile(window.innerWidth < 1000);
    }
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    setInitialized(true);
    
    // 載入 HackMD 文件
    loadHackMDDocuments();

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const loadHackMDDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      let allDocs = [];
      
      // 優先嘗試自動載入使用者的所有筆記
      const apiToken = process.env.NEXT_PUBLIC_HACKMD_API_TOKEN || localStorage.getItem('hackmd_api_token');
      
      try {
        const notesResponse = await fetch('/api/hackmd/notes');
        if (notesResponse.ok) {
          const notesData = await notesResponse.json();
          // 只顯示公開的筆記
          const publicNotes = notesData.notes.filter(note => note.isPublic);
          
          // 轉換為統一格式
          allDocs = publicNotes.map(note => ({
            id: note.shortId,
            title: note.title,
            content: '', // 暫不載入完整內容以提高效能
            description: note.description || '',
            url: note.url,
            lastModified: note.updatedAt || note.createdAt || '2024-01-01T00:00:00.000Z',
            type: 'hackmd',
            tags: note.tags || [],
            featured: false,
            configId: note.shortId,
            // 從 API 獲取的額外資訊
            createdAt: note.createdAt,
            publishType: note.publishType,
            isAutoLoaded: true // 標記為自動載入
          }));
          
          console.log(`自動載入了 ${allDocs.length} 個公開筆記`);
        } else {
          throw new Error('無法載入筆記列表');
        }
      } catch (apiError) {
        console.log('自動載入失敗，嘗試使用配置的文件:', apiError.message);
        
        // 如果自動載入失敗，使用配置的文件列表
        for (const doc of configuredDocs) {
          try {
            const response = await fetch(`/api/hackmd?noteId=${encodeURIComponent(doc.id)}`);
            if (response.ok) {
              const data = await response.json();
              allDocs.push({
                ...data,
                title: doc.title || data.title,
                description: doc.description || data.description,
                tags: doc.tags || data.tags || [],
                featured: doc.featured,
                configId: doc.id,
                isAutoLoaded: false
              });
            } else {
              console.error(`Failed to fetch HackMD document ${doc.id}:`, response.statusText);
            }
          } catch (error) {
            console.error(`Error fetching HackMD document ${doc.id}:`, error);
          }
        }
      }
      
      if (allDocs.length === 0) {
        if (configuredDocs.length === 0) {
          setError("未找到任何筆記。請確保設定了 HACKMD_API_TOKEN 環境變數，或在管理頁面配置你的筆記。");
        } else {
          setError("無法載入已配置的 HackMD 文件，請檢查筆記 ID 是否正確或稍後再試");
        }
        setDocuments([]);
      } else {
        // 按更新時間排序，精選的在前面
        allDocs.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.lastModified) - new Date(a.lastModified);
        });
        setDocuments(allDocs);
      }
    } catch (error) {
      console.error("Error loading HackMD documents:", error);
      setError("載入文件時發生錯誤：" + error.message);
      setDocuments([]);
    }
    setLoading(false);
  };

  const refreshDocuments = () => {
    loadHackMDDocuments();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "未知日期";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "未知日期";
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const calculateReadingTime = (content, description = '', title = '') => {
    // 如果沒有完整內容，使用描述和標題來估算
    const textToAnalyze = content || description || title || '';
    if (!textToAnalyze) return 3;
    
    // 中文字符數統計
    const chineseChars = (textToAnalyze.match(/[\u4e00-\u9fff]/g) || []).length;
    // 英文單詞數統計
    const englishWords = textToAnalyze.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(word => word.length > 0).length;
    
    // 如果是描述文字，估算完整文章長度（通常是描述的 8-15 倍）
    const multiplier = content ? 1 : 12;
    
    // 中文閱讀速度: 約 300-400 字/分鐘，英文: 約 200-250 詞/分鐘
    const chineseReadingSpeed = 350;
    const englishReadingSpeed = 225;
    
    const chineseTime = (chineseChars * multiplier) / chineseReadingSpeed;
    const englishTime = (englishWords * multiplier) / englishReadingSpeed;
    
    const totalMinutes = Math.ceil(chineseTime + englishTime);
    return Math.max(1, totalMinutes); // 至少 1 分鐘
  };

  // 取得所有可用的標籤
  const allTags = [...new Set(documents.flatMap(doc => doc.tags || []))];
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === "" || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesTags = selectedTags.length === 0 || 
      (doc.tags && selectedTags.every(selectedTag => doc.tags.includes(selectedTag)));
    
    return matchesSearch && matchesTags;
  });
  
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const clearAllTags = () => {
    setSelectedTags([]);
  };

  if (!initialized) return null;

  return (
    <div className="w-screen min-h-dvh relative flex justify-center">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <TitleBar 
          title="技術文件與筆記" 
          subtitle="HackMD 整合的知識庫"
        />

        {/* 控制面板 */}
        <div className="flex flex-col gap-4 mt-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜尋框 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="搜尋文件..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
         
            
            
          </div>
        </div>

        {/* 標籤雲和文件狀態 */}
        <div className="mb-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              標籤 ({allTags.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                const tagCount = documents.filter(doc => doc.tags && doc.tags.includes(tag)).length;
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                      isSelected 
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                    }`}
                  >
                    {tag} ({tagCount})
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              文件狀態
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-800 border border-green-700 rounded-full text-sm text-green-300">
                {documents.length} 個文件
              </span>
              <span className="px-3 py-1 bg-orange-800 border border-orange-700 rounded-full text-sm text-orange-300">
                {filteredDocuments.length} 個顯示
              </span>
              {documents.some(doc => doc.isAutoLoaded) && (
                <span className="px-3 py-1 bg-blue-800 border border-blue-700 rounded-full text-sm text-blue-300">
                  自動載入
                </span>
              )}
              {documents.filter(doc => doc.featured).length > 0 && (
                <span className="px-3 py-1 bg-yellow-800 border border-yellow-700 rounded-full text-sm text-yellow-300">
                  {documents.filter(doc => doc.featured).length} 個精選
                </span>
              )}
              {selectedTags.length > 0 && (
                <span className="px-3 py-1 bg-purple-800 border border-purple-700 rounded-full text-sm text-purple-300">
                  已選 {selectedTags.length} 個標籤
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 載入狀態 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-zinc-400">載入 HackMD 文件中...</span>
          </div>
        )}

        {/* 錯誤狀態 */}
        {!loading && error && (
          <div className="text-center py-12">
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {configuredDocs.length === 0 ? (
                  <Button
                    onClick={() => window.open('/blog/manage', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    前往管理頁面
                  </Button>
                ) : (
                  <Button
                    onClick={refreshDocuments}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    重試
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 文件列表 */}
        {!loading && !error && (
          <div className="grid gap-6">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">
                  {searchTerm || selectedTags.length > 0 ? "沒有找到符合條件的文件" : "暫無文件"}
                </p>
              </div>
            ) : (
              filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors p-6 ${doc.featured ? 'ring-2 ring-yellow-500/20' : ''}`}>
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {doc.featured && (
                            <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">
                              精選
                            </span>
                          )}
                          {doc.isAutoLoaded && (
                            <Badge >
                              自動載入
                            </Badge>
                          )}
                          {doc.tags && doc.tags.map(tag => (
                            <Badge 
                              key={tag} 
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-zinc-200 mb-3 hover:text-blue-400 transition-colors">
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-start gap-2"
                          >
                            {doc.title}
                            <ExternalLink className="h-4 w-4 mt-1 flex-shrink-0" />
                          </a>
                        </h3>
                        
                        <p className="text-zinc-400 mb-4 line-clamp-3">
                          {doc.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            HackMD 文件
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(doc.lastModified)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            約 {calculateReadingTime(doc.content, doc.description)} 分鐘閱讀
                          </div>
                        </div>
                      </div>
                      
                      <div className="lg:ml-4 flex gap-4 mt-auto">
                        <a 
                          href={`/blog/${doc.configId}`}
                          className="link-underline link-underline-blue"
                        >
                          閱讀文章
                        </a>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="link-underline link-underline-gray"
                        >
                          HackMD 原文
                        </a>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* 統計資訊 */}
        {!loading && filteredDocuments.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="text-sm text-zinc-500">
              顯示 {filteredDocuments.length} 個文件，共 {configuredDocs.length} 個已配置文件
            </div>
          </div>
        )}
      </div>
    </div>
  );
}