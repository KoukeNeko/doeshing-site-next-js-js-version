"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { getCodeString } from 'rehype-rewrite';
import katex from 'katex';
import 'katex/dist/katex.css';

// Add custom styles to remove background
const customStyles = {
  preview: {
    backgroundColor: 'transparent',
  },
  wrapper: {
    backgroundColor: 'transparent',
  }
};

export default function BlogPost() {
  const searchParams = useSearchParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const id = searchParams.get('id');
      if (!id) {
        setError('文章 ID 不能為空');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/posts/id?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('無法載入文章，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-zinc-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-2 md:px-4 py-8">
        <div className="bg-red-900/30 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-2 md:px-4 py-8">
        <div className="bg-zinc-900/30 text-zinc-300 p-4 rounded-lg">
          找不到文章
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-2 md:px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-zinc-400 mb-8">
        {new Date(post.created_at).toLocaleDateString()}
      </div>
      <div className="prose prose-invert max-w-none overflow-x-auto">
        <MDEditor.Markdown 
          source={post.content} 
          style={customStyles.preview}
          previewOptions={{
            style: customStyles.wrapper,
            components: {
              code: ({ inline, children = [], className, ...props }) => {
                const txt = children[0] || '';
                if (inline) {
                  if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                    const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
                      throwOnError: false,
                    });
                    return <code dangerouslySetInnerHTML={{ __html: html }} />;
                  }
                  return <code>{txt}</code>;
                }
                const code = props.node && props.node.children ? getCodeString(props.node.children) : txt;
                if (
                  typeof code === 'string' &&
                  typeof className === 'string' &&
                  /^language-katex/.test(className.toLocaleLowerCase())
                ) {
                  const html = katex.renderToString(code, {
                    throwOnError: false,
                  });
                  return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
                }
                return <code className={String(className)}>{txt}</code>;
              },
            },
          }}
        />
      </div>
    </article>
  );
} 