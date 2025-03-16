"use client";

import { ReactNode } from 'react';
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

export function ProfileCard({ 
  icon: Icon, 
  title, 
  children,
  isAdmin,
  section,
  onAdd,
  onEdit
}) {
  return (
    <Card className="bg-zinc-900/80 border-zinc-800 mb-6 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-zinc-200 flex items-center gap-2">
          <Icon size={20} />
          {title}
        </CardTitle>
        {isAdmin && section && (
          <div className="flex gap-2">
            {onAdd && (
              <button
                onClick={onAdd}
                className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                新增
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                編輯
              </button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

export function ProfileItem({ 
  icon: Icon, 
  title, 
  subtitle, 
  period, 
  location, 
  description,
  extra,
  isAdmin,
  section,
  onEdit
}) {
  const renderDescription = () => {
    if (!description) return null;
    if (Array.isArray(description)) {
      return (
        <div className="text-zinc-400 mt-2 space-y-4">
          {description.map((desc, i) => {
            // Check if it's a language marker
            if (desc.startsWith('[') && desc.endsWith(']')) {
              return (
                <h4 key={i} className="text-zinc-300 font-medium mt-4">
                  {desc}
                </h4>
              );
            }
            // Regular description text
            return (
              <p key={i} className="text-zinc-400">
                {desc}
              </p>
            );
          })}
        </div>
      );
    }
    return <p className="text-zinc-400 mt-2">{description}</p>;
  };

  return (
    <div className="group mb-6 last:mb-0">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-zinc-800 rounded-md flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-zinc-400" />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-zinc-200">{title}</h3>
              {subtitle && <p className="text-zinc-400">{subtitle}</p>}
              {period && <p className="text-sm text-zinc-500">{period}</p>}
              {location && <p className="text-sm text-zinc-500">{location}</p>}
            </div>
            {isAdmin && section && onEdit && (
              <button
                onClick={onEdit}
                className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                編輯
              </button>
            )}
          </div>
          {renderDescription()}
          {extra}
        </div>
      </div>
    </div>
  );
}