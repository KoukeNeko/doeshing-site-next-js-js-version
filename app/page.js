'use client';

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
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-zinc-300 mb-2">
          <TypewriterText
            text="歡迎來到這裡，旅人"
            typingDelay={50}
            randomVariation={30}
            delay={400}
          />
        </h1>
        <h2 className="text-2xl text-zinc-400">
          <TypewriterText
            text="Hello, 我是 陳德生!"
            typingDelay={50}
            randomVariation={30}
            delay={600}
          />
        </h2>
      </div>
      <div className="flex space-x-6">
        <a
          href="https://github.com/KoukeNeko"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400"
            onMouseEnter={() => setIsGithubHovered(true)}
            onMouseLeave={() => setIsGithubHovered(false)}
          >
            <Github
              size={20}
              fill={isGithubHovered ? "currentColor" : "none"}
            />
          </Button>
        </a>

        <a
          href="mailto:contact@doeshing.ink"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <Mail size={20} />
          </Button>
        </a>

        <a
          href="https://www.cake.me/me/doeshing"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:bg-green-600"
            onMouseEnter={() => setIsResumeHovered(true)}
            onMouseLeave={() => setIsResumeHovered(false)}
          >
            <FileUser
              size={20}
              fill={isResumeHovered ? "currentColor" : "none"}
            />
          </Button>
        </a>

        <a
          href="https://www.linkedin.com/in/doeshing/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:bg-yellow-500"
            onMouseEnter={() => setIsLinkedinHovered(true)}
            onMouseLeave={() => setIsLinkedinHovered(false)}
          >
            <LinkedinIcon
              size={20}
              fill={isLinkedinHovered ? "currentColor" : "none"}
            />
          </Button>
        </a>
      </div>
    </div>
  );
}