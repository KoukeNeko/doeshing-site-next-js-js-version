import React from 'react';
import Link from 'next/link';

export default function PostCard({ post }) {
  return (
    <article className="p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
      <h2 className="text-xl font-semibold mb-2">
        <Link href={`/blog/${post.slug}`} className="hover:text-blue-400">
          {post.title}
        </Link>
      </h2>
      <p className="text-zinc-400 mb-4">{post.excerpt}</p>
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString()}
        </time>
        {post.tags && (
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-zinc-800 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}