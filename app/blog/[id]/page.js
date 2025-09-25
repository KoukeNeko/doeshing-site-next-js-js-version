"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import TitleBar from "@/components/layout/TitleBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  RefreshCw,
  FileText,
  Calendar,
  Tag,
  List,
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Lightbulb
} from "lucide-react";
import { getAllDocuments } from "@/config/hackmd-docs";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ADMONITION_STYLES = {
  info: {
    title: "資訊",
    borderClass: "border-blue-500/60",
    backgroundClass: "bg-blue-500/10",
    icon: Info,
    iconClass: "text-blue-300"
  },
  note: {
    title: "附註",
    borderClass: "border-sky-500/60",
    backgroundClass: "bg-sky-500/10",
    icon: Info,
    iconClass: "text-sky-300"
  },
  warning: {
    title: "警告",
    borderClass: "border-amber-500/70",
    backgroundClass: "bg-amber-500/10",
    icon: AlertTriangle,
    iconClass: "text-amber-300"
  },
  danger: {
    title: "注意",
    borderClass: "border-red-500/70",
    backgroundClass: "bg-red-500/10",
    icon: AlertCircle,
    iconClass: "text-red-300"
  },
  success: {
    title: "成功",
    borderClass: "border-emerald-500/70",
    backgroundClass: "bg-emerald-500/10",
    icon: CheckCircle2,
    iconClass: "text-emerald-300"
  },
  tip: {
    title: "小技巧",
    borderClass: "border-emerald-500/70",
    backgroundClass: "bg-emerald-500/10",
    icon: Lightbulb,
    iconClass: "text-emerald-200"
  }
};

const AVAILABLE_ADMONITIONS = new Set(Object.keys(ADMONITION_STYLES));

const buildAdmonitionBlock = (type, title, bodyLines) => {
  const typeKey = AVAILABLE_ADMONITIONS.has(type) ? type : 'info';
  const config = ADMONITION_STYLES[typeKey];
  const heading = `> [!${typeKey.toUpperCase()}] ${title || config.title}`;
  const trimmedBody = bodyLines.join('\n').trimEnd();
  const output = [heading];

  if (trimmedBody.length > 0) {
    output.push('>');
    trimmedBody.split(/\r?\n/).forEach((line) => {
      output.push(`> ${line}`);
    });
  }

  output.push('');
  return output;
};

const transformHackMdAdmonitions = (content) => {
  if (!content) return '';

  const lines = content.split(/\r?\n/);
  const result = [];
  let inBlock = false;
  let blockType = '';
  let blockTitle = '';
  let blockLines = [];

  const flushBlock = () => {
    result.push(...buildAdmonitionBlock(blockType, blockTitle, blockLines));
    inBlock = false;
    blockType = '';
    blockTitle = '';
    blockLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inBlock) {
      const startMatch = line.match(/^:::(\w+)\s*(.*)$/);
      if (startMatch) {
        blockType = startMatch[1].toLowerCase();
        const rest = startMatch[2] || '';
        const inlineMatch = rest.match(/^(.*?)\s*:::\s*$/);

        if (inlineMatch) {
          blockTitle = inlineMatch[1].trim();
          blockLines = [];
          result.push(...buildAdmonitionBlock(blockType, blockTitle, blockLines));
          inBlock = false;
          blockType = '';
          blockTitle = '';
          blockLines = [];
        } else {
          inBlock = true;
          blockTitle = rest.trim();
          blockLines = [];
        }
      } else {
        result.push(line);
      }
    } else {
      if (line.trim() === ':::') {
        flushBlock();
      } else {
        blockLines.push(line);
      }
    }
  }

  if (inBlock) {
    flushBlock();
  }

  return result.join('\n').trimEnd();
};

const ADMONITION_MARKER_REGEX = /^\s*\[!(\w+)\]\s*(.*)$/i;

const getNodeText = (node) => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (Array.isArray(node)) {
    return node.map(getNodeText).join('');
  }
  if (React.isValidElement(node)) {
    return getNodeText(node.props.children);
  }
  return '';
};

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [initialized, setInitialized] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toc, setToc] = useState([]);
  const [showToc, setShowToc] = useState(false);

  // 取得文件配置
  const configuredDocs = getAllDocuments();
  const docConfig = configuredDocs.find(doc => doc.id === params.id);

  const generateHeadingId = useCallback((children) => {
    // Handle various types of children from ReactMarkdown
    let text = '';

    if (typeof children === 'string') {
      text = children;
    } else if (Array.isArray(children)) {
      // Recursively extract text from array of children
      text = children.map(child => {
        if (typeof child === 'string') return child;
        if (child?.props?.children) return generateHeadingId(child.props.children);
        return '';
      }).join('');
    } else if (children?.props?.children) {
      // Handle React elements
      text = generateHeadingId(children.props.children);
    } else if (typeof children === 'object' && children !== null) {
      // Try to convert object to string
      text = String(children);
    }

    if (!text) return 'heading';

    const id = text.toLowerCase()
      .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, ''); // 移除開頭和結尾的連字符

    return id || 'heading'; // 確保至少返回一個有效的ID
  }, []);

  const generateToc = useCallback((content) => {
    if (!content) return;

    const lines = content.split('\n');
    const headings = [];

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = generateHeadingId(text);

        headings.push({
          id,
          text,
          level,
          line: index
        });
      }
    });

    setToc(headings);
  }, [generateHeadingId]);

  const loadDocument = useCallback(async () => {
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
          configId: params.id
        };

        const processedContent = transformHackMdAdmonitions(doc.content);
        const enrichedDoc = {
          ...doc,
          processedContent
        };

        setDocumentData(enrichedDoc);

        // 生成目錄
        generateToc(processedContent);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch document: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error loading document:", error);
      setError("載入文件時發生錯誤：" + error.message);
    }
    setLoading(false);
  }, [docConfig, generateToc, params.id]);

  useEffect(() => {
    setInitialized(true);
    loadDocument();
  }, [loadDocument]);

  const scrollToHeading = (id) => {
    try {
      if (!id) {
        console.warn('scrollToHeading: No ID provided');
        return;
      }

      const element = document.getElementById(id);
      if (element) {
        // 取得元素位置並減去偏移量（例如 80px 給固定的 header）
        const offsetTop = 80; // 調整這個值來改變距離頂部的距離
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offsetTop;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        console.warn(`scrollToHeading: Element with ID "${id}" not found`);
      }
    } catch (error) {
      console.error('Error in scrollToHeading:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "未知日期";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "未知日期";
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const calculateReadingTime = (content) => {
    if (!content) return 0;
    // 中文字符數統計
    const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length;
    // 英文單詞數統計
    const englishWords = content.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(word => word.length > 0).length;
    
    // 中文閱讀速度: 約 300-400 字/分鐘，英文: 約 200-250 詞/分鐘
    const chineseReadingSpeed = 350;
    const englishReadingSpeed = 225;
    
    const chineseTime = chineseChars / chineseReadingSpeed;
    const englishTime = englishWords / englishReadingSpeed;
    
    const totalMinutes = Math.ceil(chineseTime + englishTime);
    return Math.max(1, totalMinutes); // 至少 1 分鐘
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

  //debug
  console.log("Document Config:", docConfig);
  console.log("Loaded Document:", documentData);
  console.log("TOC:", toc);

  return (
    <div className="w-screen min-h-dvh relative flex justify-center mt-16">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* 返回按鈕 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="link-underline link-underline-gray"
          >
            ← 返回文件列表
          </button>
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

        {documentData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 文件標題和元資訊 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {documentData.featured && (
                  <Badge className="bg-yellow-600 text-white text-xs hover:bg-yellow-700">
                    精選
                  </Badge>
                )}
                {documentData.tags && documentData.tags.filter(tag => tag && typeof tag === 'string').map(tag => (
                  <Badge key={tag} variant="outline" className="border-zinc-700 text-zinc-300 text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold text-zinc-200 mb-4">
                {documentData.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-500">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    HackMD 文件
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(documentData.lastModified)}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📖</span>
                    約 {calculateReadingTime(documentData.content)} 分鐘閱讀
                  </div>
                </div>

                <div className="flex gap-4">
                  {toc.length > 0 && (
                    <button
                      onClick={() => setShowToc(!showToc)}
                      className="link-underline link-underline-gray"
                    >
                      目錄 ({toc.length})
                    </button>
                  )}
                  <button
                    onClick={copyToClipboard}
                    className="link-underline link-underline-gray"
                  >
                    {copied ? "已複製" : "分享"}
                  </button>
                  <a 
                    href={documentData.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-underline link-underline-blue"
                  >
                    HackMD 原文
                  </a>
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
                        onClick={(e) => {
                          e.preventDefault();
                          if (heading?.id) {
                            scrollToHeading(heading.id);
                          } else {
                            console.warn('Heading ID is missing:', heading);
                          }
                        }}
                        className={`flex items-center w-full text-left px-3 py-2 rounded text-sm hover:bg-zinc-800 transition-colors ${
                          heading.level === 1 ? 'text-zinc-200 font-semibold' :
                          heading.level === 2 ? 'text-zinc-300 font-medium pl-6' :
                          heading.level === 3 ? 'text-zinc-400 pl-8' :
                          'text-zinc-500 pl-10'
                        }`}
                        style={{
                          paddingLeft: `${(heading.level - 1) * 0.75 + 0.75}rem`
                        }}
                      >
                        <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{heading.text}</span>
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
                      const id = generateHeadingId(children);
                      return (
                        <h1 id={id} className="text-3xl font-bold text-zinc-200 mb-6 border-b border-zinc-700 pb-3 mt-8 first:mt-0 scroll-mt-4">
                          {children}
                        </h1>
                      );
                    },
                    h2: ({children}) => {
                      const id = generateHeadingId(children);
                      return (
                        <h2 id={id} className="text-2xl font-semibold text-zinc-200 mb-4 mt-8 border-l-4 border-blue-500 pl-4 scroll-mt-4">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({children}) => {
                      const id = generateHeadingId(children);
                      return (
                        <h3 id={id} className="text-xl font-medium text-zinc-200 mb-3 mt-6 scroll-mt-4">
                          {children}
                        </h3>
                      );
                    },
                    h4: ({children}) => {
                      const id = generateHeadingId(children);
                      return (
                        <h4 id={id} className="text-lg font-medium text-zinc-300 mb-2 mt-4 scroll-mt-4">
                          {children}
                        </h4>
                      );
                    },
                    p: ({children}) => {
                      if (!children) return null;

                      // Check if children contains block-level elements
                      const hasBlockLevel = Array.isArray(children)
                        ? children.some(child =>
                            child?.type === 'div' ||
                            child?.props?.originalType === 'img' ||
                            child?.props?.originalType === 'div' ||
                            (typeof child === 'object' && child?.props?.mdxType === 'img')
                          )
                        : (typeof children === 'object' && (
                            children?.type === 'div' ||
                            children?.props?.originalType === 'img' ||
                            children?.props?.originalType === 'div' ||
                            children?.props?.mdxType === 'img'
                          ));

                      // If block-level elements are present, render as div instead of p
                      if (hasBlockLevel) {
                        return (
                          <div className="text-zinc-300 mb-4 leading-relaxed text-base">
                            {children}
                          </div>
                        );
                      }

                      return (
                        <p className="text-zinc-300 mb-4 leading-relaxed text-base">
                          {children}
                        </p>
                      );
                    },
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
                    blockquote: ({ children }) => {
                      const nodeArray = React.Children.toArray(children);
                      if (nodeArray.length === 0) {
                        return null;
                      }

                      let typeKey = null;
                      let customTitle = '';

                      const firstNode = nodeArray[0];
                      if (React.isValidElement(firstNode)) {
                        const firstText = getNodeText(firstNode.props.children);
                        const markerMatch = firstText.match(ADMONITION_MARKER_REGEX);
                        if (markerMatch) {
                          typeKey = markerMatch[1].toLowerCase();
                          customTitle = markerMatch[2]?.trim() || '';
                        }
                      }

                      if (!typeKey || !ADMONITION_STYLES[typeKey]) {
                        return (
                          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-zinc-800/30 rounded-r mb-4 italic text-zinc-300">
                            {children}
                          </blockquote>
                        );
                      }

                      const { borderClass, backgroundClass, icon: IconComponent, iconClass, title } = ADMONITION_STYLES[typeKey];
                      const contentNodes = nodeArray.slice(1);

                      return (
                        <div className={`my-6 rounded-lg border ${borderClass} ${backgroundClass} px-4 py-3`}>
                          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                            <IconComponent className={`h-4 w-4 ${iconClass}`} />
                            <span>{customTitle || title}</span>
                          </div>
                          {contentNodes.length > 0 && (
                            <div className="mt-3 space-y-3 text-sm text-zinc-200">
                              {contentNodes.map((node, index) => (
                                <React.Fragment key={index}>{node}</React.Fragment>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    },
                    ul: ({children}) => {
                      if (!children) return null;
                      return (
                        <ul className="text-zinc-300 mb-4 pl-6 space-y-2 list-disc marker:text-blue-400">
                          {children}
                        </ul>
                      );
                    },
                    ol: ({children}) => {
                      if (!children) return null;
                      return (
                        <ol className="text-zinc-300 mb-4 pl-6 space-y-2 list-decimal marker:text-blue-400">
                          {children}
                        </ol>
                      );
                    },
                    li: ({children}) => {
                      if (!children) return null;
                      return (
                        <li className="leading-relaxed">
                          {children}
                        </li>
                      );
                    },
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
                    tr: ({children}) => {
                      if (!children) return null;
                      return (
                        <tr className="border-b border-zinc-700 hover:bg-zinc-800/30">
                          {children}
                        </tr>
                      );
                    },
                    th: ({children}) => {
                      if (!children) return null;
                      return (
                        <th className="border border-zinc-600 px-4 py-2 text-left font-semibold text-zinc-200">
                          {children}
                        </th>
                      );
                    },
                    td: ({children}) => {
                      if (!children) return null;
                      return (
                        <td className="border border-zinc-600 px-4 py-2 text-zinc-300">
                          {children}
                        </td>
                      );
                    },
                    hr: () => (
                      <hr className="my-8 border-zinc-700" />
                    ),
                    img: ({src, alt}) => {
                      if (!src) return null;
                      return (
                        <span className="block my-6">
                          <img
                            src={src}
                            alt={alt}
                            className="max-w-full h-auto rounded-lg border border-zinc-700 shadow-lg"
                          />
                          {alt && (
                            <span className="block text-center text-sm text-zinc-400 mt-2 italic">
                              {alt}
                            </span>
                          )}
                        </span>
                      );
                    },
                  }}
                >
                  {documentData.processedContent || documentData.content}
                </ReactMarkdown>
              </article>
            </Card>

            {/* 頁面底部動作 */}
            <div className="flex justify-between items-center pt-6">
              <button
                onClick={() => router.push('/blog')}
                className="link-underline link-underline-gray"
              >
                ← 返回文件列表
              </button>

              <button
                onClick={loadDocument}
                className="link-underline link-underline-blue"
                disabled={loading}
              >
                重新載入
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}