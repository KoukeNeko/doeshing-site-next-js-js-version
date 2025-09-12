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
  Check,
  List,
  ChevronRight
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
  const [toc, setToc] = useState([]);
  const [showToc, setShowToc] = useState(false);

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
    
    // 無論是否在配置中都嘗試載入文件
    loadDocument();

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
        const doc = {
          ...data,
          title: (docConfig?.title) || data.title,
          description: (docConfig?.description) || data.description,
          tags: (docConfig?.tags) || data.tags || [],
          featured: (docConfig?.featured) || false,
          configId: params.id,
          isFromConfig: !!docConfig
        };
        
        setDocument(doc);
        
        // 生成目錄
        generateToc(doc.content);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch document: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error loading document:", error);
      setError("載入文件時發生錯誤：" + error.message);
    }
    setLoading(false);
  };

  const generateToc = (content) => {
    if (!content) return;
    
    const lines = content.split('\n');
    const headings = [];
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase()
          .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
          .replace(/\s+/g, '-');
        
        headings.push({
          id,
          text,
          level,
          line: index
        });
      }
    });
    
    setToc(headings);
  };

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
    <div className="w-screen min-h-dvh relative flex justify-center mt-16">
      <div className="container max-w-6xl mx-auto px-4 py-8">
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
              <div className="text-sm text-zinc-400 mb-4">
                文件 ID: <code className="bg-zinc-800 px-1 py-0.5 rounded">{params.id}</code>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  onClick={loadDocument}
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  重試
                </Button>
                <Button
                  onClick={() => router.push('/blog')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  返回首頁
                </Button>
              </div>
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
                {document.isFromConfig ? (
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                    已配置
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                    自動載入
                  </span>
                )}
                {document.tags && document.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                    <Tag className="h-3 w-3 mr-1 inline" />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl font-bold text-zinc-200 mb-4">
                {document.title}
              </h1>

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
                  {toc.length > 0 && (
                    <Button
                      onClick={() => setShowToc(!showToc)}
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                      <List className="h-4 w-4 mr-1" />
                      目錄 ({toc.length})
                    </Button>
                  )}
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

            {/* 目錄 */}
            {showToc && toc.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="bg-zinc-900 border-zinc-800 p-4 mb-6">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center">
                    <List className="h-5 w-5 mr-2" />
                    文章目錄
                  </h3>
                  <nav className="space-y-1">
                    {toc.map((heading, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToHeading(heading.id)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm hover:bg-zinc-800 transition-colors ${
                          heading.level === 1 ? 'text-zinc-200 font-semibold' :
                          heading.level === 2 ? 'text-zinc-300 font-medium pl-6' :
                          heading.level === 3 ? 'text-zinc-400 pl-8' :
                          'text-zinc-500 pl-10'
                        }`}
                        style={{
                          paddingLeft: `${(heading.level - 1) * 0.75 + 0.75}rem`
                        }}
                      >
                        <div className="flex items-center">
                          <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{heading.text}</span>
                        </div>
                      </button>
                    ))}
                  </nav>
                </Card>
              </motion.div>
            )}

            {/* 文件內容 */}
            <Card className="bg-zinc-900 border-zinc-800 p-8">
              <article className="prose prose-invert prose-zinc p-6">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // 自訂 markdown 元件樣式
                    h1: ({children}) => {
                      const id = String(children).toLowerCase()
                        .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
                        .replace(/\s+/g, '-');
                      return (
                        <h1 id={id} className="text-3xl font-bold text-zinc-200 mb-6 border-b border-zinc-700 pb-3 mt-8 first:mt-0 scroll-mt-4">
                          {children}
                        </h1>
                      );
                    },
                    h2: ({children}) => {
                      const id = String(children).toLowerCase()
                        .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
                        .replace(/\s+/g, '-');
                      return (
                        <h2 id={id} className="text-2xl font-semibold text-zinc-200 mb-4 mt-8 border-l-4 border-blue-500 pl-4 scroll-mt-4">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({children}) => {
                      const id = String(children).toLowerCase()
                        .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
                        .replace(/\s+/g, '-');
                      return (
                        <h3 id={id} className="text-xl font-medium text-zinc-200 mb-3 mt-6 scroll-mt-4">
                          {children}
                        </h3>
                      );
                    },
                    h4: ({children}) => {
                      const id = String(children).toLowerCase()
                        .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
                        .replace(/\s+/g, '-');
                      return (
                        <h4 id={id} className="text-lg font-medium text-zinc-300 mb-2 mt-4 scroll-mt-4">
                          {children}
                        </h4>
                      );
                    },
                    p: ({children}) => (
                      <p className="text-zinc-300 mb-4 leading-relaxed text-base">
                        {children}
                      </p>
                    ),
                    a: ({href, children}) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                      >
                        {children}
                      </a>
                    ),
                    code: ({inline, children}) => {
                      if (inline) {
                        return (
                          <code className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono border border-zinc-700">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className="text-zinc-200 font-mono text-sm">
                          {children}
                        </code>
                      );
                    },
                    pre: ({children}) => (
                      <pre className="bg-zinc-800 border border-zinc-700 text-zinc-200 p-4 rounded-lg overflow-x-auto mb-6 text-sm leading-relaxed">
                        {children}
                      </pre>
                    ),
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-zinc-800/30 rounded-r mb-4 italic text-zinc-300">
                        {children}
                      </blockquote>
                    ),
                    ul: ({children}) => (
                      <ul className="text-zinc-300 mb-4 pl-6 space-y-2 list-disc marker:text-blue-400">
                        {children}
                      </ul>
                    ),
                    ol: ({children}) => (
                      <ol className="text-zinc-300 mb-4 pl-6 space-y-2 list-decimal marker:text-blue-400">
                        {children}
                      </ol>
                    ),
                    li: ({children}) => (
                      <li className="leading-relaxed">
                        {children}
                      </li>
                    ),
                    table: ({children}) => (
                      <div className="overflow-x-auto mb-6">
                        <table className="min-w-full border-collapse border border-zinc-700 bg-zinc-800/50">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({children}) => (
                      <thead className="bg-zinc-700">
                        {children}
                      </thead>
                    ),
                    tbody: ({children}) => (
                      <tbody>
                        {children}
                      </tbody>
                    ),
                    tr: ({children}) => (
                      <tr className="border-b border-zinc-700 hover:bg-zinc-800/30">
                        {children}
                      </tr>
                    ),
                    th: ({children}) => (
                      <th className="border border-zinc-600 px-4 py-2 text-left font-semibold text-zinc-200">
                        {children}
                      </th>
                    ),
                    td: ({children}) => (
                      <td className="border border-zinc-600 px-4 py-2 text-zinc-300">
                        {children}
                      </td>
                    ),
                    hr: () => (
                      <hr className="my-8 border-zinc-700" />
                    ),
                    img: ({src, alt}) => (
                      <div className="my-6">
                        <img 
                          src={src} 
                          alt={alt}
                          className="max-w-full h-auto rounded-lg border border-zinc-700 shadow-lg"
                        />
                        {alt && (
                          <p className="text-center text-sm text-zinc-400 mt-2 italic">
                            {alt}
                          </p>
                        )}
                      </div>
                    ),
                  }}
                >
                  {document.content}
                </ReactMarkdown>
              </article>
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