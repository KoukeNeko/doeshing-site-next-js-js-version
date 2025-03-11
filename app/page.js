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
      <div className="z-30 absolute top-0 left-0 w-full h-full">
        <CardAnimationDesktop />
      </div>

      {/* Social Buttons - Floating on right side */}
      <div className="absolute top-1/2 right-44 flex flex-col items-center justify-center bg-amber-900 z-10">
        <div className="flex flex-col space-y-4 mb-8">
          <TypewriterText
            text="Hello, I'm Kevin Kang"
            className="text-3xl font-bold"
          />
          <TypewriterText
            text="I'm a software engineer"
            className="text-3xl font-bold"
          />
        </div>

        <div className="flex space-x-6">
          <Button
            className="mb-4"
            href="https://www.linkedin.com/in/kevin-kang-1a0b1b1b4/"
            onMouseEnter={() => setIsLinkedinHovered(true)}
            onMouseLeave={() => setIsLinkedinHovered(false)}
          >
            <LinkedinIcon size={24} />
          </Button>
          <Button
            className="mb-4"
            href="/resume.pdf"
            onMouseEnter={() => setIsResumeHovered(true)}
            onMouseLeave={() => setIsResumeHovered(false)}
          >
            <FileUser size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}
