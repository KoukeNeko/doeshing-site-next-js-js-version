"use client";

import React from 'react';
import { useParams } from 'next/navigation';

export default function BlogPost() {
  const { slug } = useParams();
  
  // TODO: 根據 slug 從數據庫或API獲取文章內容
  const post = {
    title: "示例文章",
    content: "這是文章的內容...",
    date: "2024-03-21"
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-zinc-400 mb-8">
        {new Date(post.date).toLocaleDateString()}
      </div>
      <div className="prose prose-invert max-w-none">
        {post.content}
      </div>
    </article>
  );
}