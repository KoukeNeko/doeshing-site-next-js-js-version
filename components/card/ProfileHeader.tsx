"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../ui/card";

export function ProfileHeader({
  avatar,
  name,
  role,
  location,
  connections,
  isAdmin,
  onEdit,
}) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 mb-6 mt-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={avatar}
            alt={typeof name === "string" ? name : undefined}
            className="w-32 h-32 rounded-full"
          />
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-zinc-200 my-2">{name}</h1>
                <p className="text-zinc-400">{role}</p>
                <p className="text-zinc-500 flex items-center gap-2">
                  <span>{location}</span>
                </p>
                <p className="text-zinc-500">{connections}</p>
              </div>
              {isAdmin && onEdit && (
                <button
                  onClick={onEdit}
                  className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  編輯
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}