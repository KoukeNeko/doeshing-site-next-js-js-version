"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TitleBar from "@/components/layout/TitleBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  RefreshCw,
  FileText,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  Copy,
  Check,
  Settings,
  Download,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function BlogManagePage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showPrivate, setShowPrivate] = useState(false);
  const [testNoteId, setTestNoteId] = useState('');
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    loadUserNotes();
  }, []);

  const loadUserNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/hackmd/notes');
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch notes');
      }
    } catch (error) {
      console.error("Error loading user notes:", error);
      setError("載入筆記時發生錯誤：" + error.message);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const copyConfig = async (config) => {
    try {
      const configText = `    {
      id: "${config.id}",
      title: "${config.title}",
      description: "${config.description}",
      category: "${config.category}",
      tags: ${JSON.stringify(config.tags)},
      featured: ${config.featured}
    },`;
      
      await navigator.clipboard.writeText(configText);
      setCopied(config.id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const copyAllConfigs = async () => {
    try {
      const publicNotes = notes.filter(note => note.isPublic);
      const configsText = `// 自動生成的 HackMD 文件配置
export const hackmdConfig = {
  documents: [
${publicNotes.map(note => `    {
      id: "${note.shortId}",
      title: "${note.title}",
      description: "${note.description || ''}",
      category: "未分類", // 請手動設定適當的分類
      tags: ${JSON.stringify(note.tags)},
      featured: false // 請手動設定是否為精選
    }`).join(',\n')}
  ],
  // ... 其他配置保持不變
};`;
      
      await navigator.clipboard.writeText(configsText);
      setCopied('all');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const testSingleNote = async () => {
    if (!testNoteId.trim()) return;
    
    setTestResult({ loading: true });
    try {
      const response = await fetch(`/api/hackmd?noteId=${encodeURIComponent(testNoteId.trim())}`);
      const data = await response.json();
      
      if (response.ok) {
        setTestResult({ 
          success: true, 
          data,
          config: {
            id: testNoteId.trim(),
            title: data.title,
            description: data.description,
            category: "測試",
            tags: data.tags || [],
            featured: false
          }
        });
      } else {
        setTestResult({ error: data.error || 'Failed to fetch note' });
      }
    } catch (error) {
      setTestResult({ error: error.message });
    }
  };

  const filteredNotes = showPrivate ? notes : notes.filter(note => note.isPublic);

  return (
    <div className="w-screen min-h-dvh relative flex justify-center">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* 返回按鈕 */}
        <div className="mb-6">
          <Button
            onClick={() => router.push('/blog')}
            variant="ghost"
            className="text-zinc-400 hover:text-zinc-200 p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回 Blog
          </Button>
        </div>

        <TitleBar 
          title="HackMD 筆記管理" 
          subtitle="管理和配置你的 HackMD 文件"
        />

        {/* 控制面板 */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 mb-6">
          <div className="flex gap-4 flex-1">
            <Button
              onClick={() => setShowPrivate(!showPrivate)}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              {showPrivate ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPrivate ? "隱藏私人筆記" : "顯示私人筆記"}
            </Button>
            
            <Button
              onClick={copyAllConfigs}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              disabled={notes.filter(note => note.isPublic).length === 0}
            >
              {copied === 'all' ? <Check className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              {copied === 'all' ? "已複製" : "匯出所有配置"}
            </Button>
          </div>
          
          <Button
            onClick={loadUserNotes}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            重新整理
          </Button>
        </div>

        {/* 統計資訊 */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-zinc-900 border-zinc-800 p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{notes.length}</div>
              <div className="text-sm text-zinc-400">總筆記數</div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{notes.filter(note => note.isPublic).length}</div>
              <div className="text-sm text-zinc-400">公開筆記</div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{notes.filter(note => !note.isPublic).length}</div>
              <div className="text-sm text-zinc-400">私人筆記</div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{notes.filter(note => note.tags.length > 0).length}</div>
              <div className="text-sm text-zinc-400">有標籤筆記</div>
            </Card>
          </div>
        )}

        {/* 載入狀態 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-zinc-400">載入筆記中...</span>
          </div>
        )}

        {/* 錯誤狀態 */}
        {!loading && error && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <Settings className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-400 mb-4">{error}</p>
                <div className="text-sm text-zinc-400 mb-4">
                  請確保已設定 HACKMD_API_TOKEN 環境變數
                </div>
                <Button
                  onClick={loadUserNotes}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  重試
                </Button>
              </div>
            </div>

            {/* 單一筆記測試 */}
            <Card className="bg-zinc-900 border-zinc-800 p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-zinc-200 mb-4">測試單一筆記</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="輸入筆記 ID 或 shortId..."
                    value={testNoteId}
                    onChange={(e) => setTestNoteId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && testSingleNote()}
                  />
                  <Button
                    onClick={testSingleNote}
                    disabled={!testNoteId.trim() || testResult?.loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {testResult?.loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : '測試'}
                  </Button>
                </div>

                {testResult && !testResult.loading && (
                  <div className={`p-4 rounded-lg ${
                    testResult.success ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'
                  }`}>
                    {testResult.success ? (
                      <div>
                        <div className="text-green-400 font-medium mb-2">✅ 筆記載入成功！</div>
                        <div className="text-sm text-zinc-300 mb-3">
                          <strong>標題：</strong>{testResult.data.title}<br/>
                          <strong>URL：</strong><a href={testResult.data.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{testResult.data.url}</a>
                        </div>
                        <Button
                          onClick={() => copyConfig(testResult.config)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {copied === testResult.config.id ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                          複製配置
                        </Button>
                      </div>
                    ) : (
                      <div className="text-red-400">
                        ❌ 載入失敗：{testResult.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* 筆記列表 */}
        {!loading && !error && (
          <div className="grid gap-4">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">
                  {showPrivate ? "沒有找到任何筆記" : "沒有找到公開筆記"}
                </p>
              </div>
            ) : (
              filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-white text-xs rounded ${
                            note.isPublic ? 'bg-green-600' : 'bg-red-600'
                          }`}>
                            {note.isPublic ? '公開' : '私人'}
                          </span>
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                            {note.publishType}
                          </span>
                          {note.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                              <Tag className="h-3 w-3 mr-1 inline" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                          {note.title}
                        </h3>
                        
                        <p className="text-zinc-400 mb-3 text-sm">
                          ID: <code className="bg-zinc-800 px-1 py-0.5 rounded">{note.shortId}</code>
                        </p>
                        
                        {note.description && (
                          <p className="text-zinc-400 mb-4 line-clamp-2">
                            {note.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            建立: {formatDate(note.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            更新: {formatDate(note.updatedAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="lg:ml-4 flex flex-col gap-2 min-w-[120px]">
                        <Button
                          asChild
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <a 
                            href={note.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            查看
                          </a>
                        </Button>
                        
                        {note.isPublic && (
                          <Button
                            onClick={() => copyConfig(note.configSuggestion)}
                            size="sm"
                            variant="outline"
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                          >
                            {copied === note.shortId ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                            {copied === note.shortId ? "已複製" : "複製配置"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}