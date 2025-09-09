"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TitleBar from "@/components/layout/TitleBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  ExternalLink, 
  RefreshCw, 
  Rss, 
  Clock,
  User,
  Tag,
  Search
} from "lucide-react";

export default function BlogPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [rssFeeds, setRssFeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // RSS 來源列表
  const rssSources = [
    { name: "EM", url: "https://emtech.cc/rss.xml", category: "EM" }
  ];

  useEffect(() => {
    function checkScreenSize() {
      setIsMobile(window.innerWidth < 1000);
    }
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    setInitialized(true);
    
    // 載入初始的 RSS 內容
    loadRSSFeeds();

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const loadRSSFeeds = async () => {
    setLoading(true);
    setError(null);
    try {
      const allFeeds = [];
      
      // 從所有 RSS 來源獲取數據
      for (const source of rssSources) {
        try {
          const response = await fetch(`/api/rss?url=${encodeURIComponent(source.url)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.items) {
              // 為每個項目添加來源信息
              const itemsWithSource = data.items.map(item => ({
                ...item,
                source: source.name,
                category: item.category || source.category
              }));
              allFeeds.push(...itemsWithSource);
            }
          } else {
            console.error(`Failed to fetch RSS from ${source.name}:`, response.statusText);
          }
        } catch (error) {
          console.error(`Error fetching RSS from ${source.name}:`, error);
        }
      }
      
      if (allFeeds.length === 0) {
        setError("無法載入 RSS 內容，請稍後再試");
      } else {
        // 按發布日期排序（最新的在前面）
        allFeeds.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        setRssFeeds(allFeeds);
      }
    } catch (error) {
      console.error("Error loading RSS feeds:", error);
      setError("載入 RSS 時發生錯誤：" + error.message);
      setRssFeeds([]);
    }
    setLoading(false);
  };

  const refreshFeeds = () => {
    loadRSSFeeds();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const filteredFeeds = rssFeeds.filter(feed =>
    feed.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!initialized) return null;

  return (
    <div className="w-screen min-h-dvh relative flex justify-center">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <TitleBar 
          title="Blog & RSS Reader" 
          subtitle="最新文章和技術動態"
        />

        {/* 控制面板 */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 mb-6">
          {/* 搜尋框 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="搜尋文章..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* 重新整理按鈕 */}
          <Button
            onClick={refreshFeeds}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            重新整理
          </Button>
        </div>

        {/* RSS 來源狀態 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center">
            <Rss className="h-5 w-5 mr-2" />
            RSS 來源
          </h3>
          <div className="flex flex-wrap gap-2">
            {rssSources.map((source, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-300"
              >
                {source.name}
              </span>
            ))}
          </div>
        </div>

        {/* 載入狀態 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-zinc-400">載入中...</span>
          </div>
        )}

        {/* 錯誤狀態 */}
        {!loading && error && (
          <div className="text-center py-12">
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <Rss className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                onClick={refreshFeeds}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                重試
              </Button>
            </div>
          </div>
        )}

        {/* 文章列表 */}
        {!loading && !error && (
          <div className="grid gap-6">
            {filteredFeeds.length === 0 ? (
              <div className="text-center py-12">
                <Rss className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">
                  {searchTerm ? "沒有找到符合搜尋條件的文章" : "暫無文章"}
                </p>
              </div>
            ) : (
              filteredFeeds.map((feed, index) => (
                <motion.div
                  key={feed.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                            {feed.source}
                          </span>
                          <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                            <Tag className="h-3 w-3 mr-1 inline" />
                            {feed.category}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-zinc-200 mb-3 hover:text-blue-400 transition-colors">
                          <a 
                            href={feed.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-start gap-2"
                          >
                            {feed.title}
                            <ExternalLink className="h-4 w-4 mt-1 flex-shrink-0" />
                          </a>
                        </h3>
                        
                        <p className="text-zinc-400 mb-4 line-clamp-3">
                          {feed.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {feed.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(feed.pubDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            5 分鐘閱讀
                          </div>
                        </div>
                      </div>
                      
                      <div className="lg:ml-4">
                        <Button
                          asChild
                          className="bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        >
                          <a 
                            href={feed.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            閱讀全文
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* 分頁或載入更多 */}
        {!loading && filteredFeeds.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => console.log("載入更多文章")}
              className="bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              載入更多文章
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}