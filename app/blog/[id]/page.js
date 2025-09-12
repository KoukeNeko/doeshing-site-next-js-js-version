"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import TitleBar from "@/components/layout/TitleBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  FileText,
  Calendar,
  Tag,
  Copy,
  Check
} from "lucide-react";
import { getAllDocuments } from "@/config/hackmd-docs";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // 取得文件配置
  const configuredDocs = getAllDocuments();
  const docConfig = configuredDocs.find(doc => doc.id === params.id);

  useEffect(() => {
    function checkScreenSize() {
      setIsMobile(window.innerWidth < 1000);
    }
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    setInitialized(true);
    
    if (docConfig) {
      loadDocument();
    } else {
      setError("找不到指定的文件配置");
      setLoading(false);
    }

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [params.id]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/hackmd?noteId=${encodeURIComponent(params.id)}`);
      if (response.ok) {
        const data = await response.json();
        // 合併配置信息和 API 返回的內容
        setDocument({
          ...data,
          title: docConfig.title || data.title,
          description: docConfig.description || data.description,
          category: docConfig.category,
          tags: docConfig.tags,
          featured: docConfig.featured,
          configId: docConfig.id
        });
      } else {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error loading document:", error);
      setError("載入文件時發生錯誤：" + error.message);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  if (!initialized) return null;

  return (
    <div className="w-screen min-h-dvh relative flex justify-center">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* 返回按鈕 */}
        <div className="mb-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-zinc-400 hover:text-zinc-200 p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回文件列表
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-zinc-400">載入文件中...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                onClick={() => router.push('/blog')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                返回首頁
              </Button>
            </div>
          </div>
        )}

        {document && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 文件標題和元資訊 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                {document.featured && (
                  <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">
                    精選
                  </span>
                )}
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                  {document.category}
                </span>
                {document.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                    <Tag className="h-3 w-3 mr-1 inline" />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl font-bold text-zinc-200 mb-4">
                {document.title}
              </h1>

              <p className="text-zinc-400 mb-6">
                {document.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-500">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    HackMD 文件
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(document.lastModified)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "已複製" : "分享"}
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <a 
                      href={document.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      HackMD 原文
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* 文件內容 */}
            <Card className="bg-zinc-900 border-zinc-800 p-8">
              <div className="prose prose-invert prose-zinc max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // 自訂 markdown 元件樣式
                    h1: ({children}) => <h1 className="text-3xl font-bold text-zinc-200 mb-6 border-b border-zinc-700 pb-2">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-semibold text-zinc-200 mb-4 mt-8">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-medium text-zinc-200 mb-3 mt-6">{children}</h3>,
                    p: ({children}) => <p className="text-zinc-300 mb-4 leading-relaxed">{children}</p>,
                    a: ({href, children}) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                      >
                        {children}
                      </a>
                    ),
                    code: ({children}) => (
                      <code className="bg-zinc-800 text-zinc-200 px-1 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({children}) => (
                      <pre className="bg-zinc-800 text-zinc-200 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                        {children}
                      </pre>
                    ),
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-zinc-800/50 rounded-r mb-4 italic text-zinc-300">
                        {children}
                      </blockquote>
                    ),
                    ul: ({children}) => <ul className="text-zinc-300 mb-4 pl-6 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="text-zinc-300 mb-4 pl-6 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="list-disc">{children}</li>,
                  }}
                >
                  {document.content}
                </ReactMarkdown>
              </div>
            </Card>

            {/* 頁面底部動作 */}
            <div className="flex justify-between items-center pt-6">
              <Button
                onClick={() => router.push('/blog')}
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回文件列表
              </Button>

              <Button
                onClick={loadDocument}
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                重新載入
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}