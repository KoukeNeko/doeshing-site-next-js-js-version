"use client";

import CardAnimation from "@/components/card/CardAnimation";
import TypewriterText from "@/components/effect/typewriter_gpt_style";
import { Button } from "@/components/ui/button";
import { LinkedinIcon, Mail, FileUser, Github } from "lucide-react";
import { useState } from "react";
import CardAnimationDesktop from "../components/card/CardAnimationDesktop";

export default function Home() {
  const [isLinkedinHovered, setIsLinkedinHovered] = useState(false);
  const [isResumeHovered, setIsResumeHovered] = useState(false);
  const [isGithubHovered, setIsGithubHovered] = useState(false);

  return (
    <div className="w-screen h-screen relative flex">
      {/* Card Animation - Full Screen (Left) */}
      <div className="z-0 absolute top-0 left-0 w-full h-full">
        <CardAnimationDesktop />
      </div>

      {/* Social Buttons - Floating on right side */}
      <div className="absolute top-1/2 right-1/3 flex flex-col items-center justify-center z-10"
        // 使用 Transform 來調整位置
        style={{ transform: "translate(50%, -50%)" }}
      >
        <div className="flex flex-col space-y-4 mb-8">
          <TypewriterText
            text="Hello, I'm 陳德生"
            className="text-3xl font-bold"
          />
          <TypewriterText
            text="I'm a software engineer"
            className="text-3xl font-bold"
          />
        </div>

        <div className="flex space-x-6">
          <Button
            className="mb-4 cursor-pointer"
            href="https://www.linkedin.com/in/doeshing/"
            onMouseEnter={() => setIsLinkedinHovered(true)}
            onMouseLeave={() => setIsLinkedinHovered(false)}
          >
            <LinkedinIcon size={24} />
          </Button>
          <Button
            className="mb-4 cursor-pointer"
            href="/resume.pdf"
            onMouseEnter={() => setIsResumeHovered(true)}
            onMouseLeave={() => setIsResumeHovered(false)}
          >
            <FileUser size={24} />
          </Button>
          <Button
            className="mb-4 cursor-pointer"
            href=""
            onMouseEnter={() => setIsGithubHovered(true)}
            onMouseLeave={() => setIsGithubHovered(false)}
          >
            <Github size={24} />
          </Button>
          <Button
            className="mb-4 cursor-pointer"
            href="mailto:contact@doeshinf.ink"
          >
            <Mail size={24} />
          </Button>

        </div>
      </div>
    </div>
  );
}
