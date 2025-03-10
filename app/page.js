'use client';

import CardAnimation from "@/components/card/CardAnimation";
import TypewriterText from "@/components/effect/typewriter_gpt_style";
import { Button } from "@/components/ui/button";
import {
  LinkedinIcon,
  Mail,
  FileUser,
  Github,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isLinkedinHovered, setIsLinkedinHovered] = useState(false);
  const [isResumeHovered, setIsResumeHovered] = useState(false);
  const [isGithubHovered, setIsGithubHovered] = useState(false);

  return (
    // <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
    <div className="w-screen h-screen">
      {/* 名牌動畫 */}
      <CardAnimation />

    </div>
  );
}