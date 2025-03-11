"use client";

import { useEffect } from "react";
import CardAnimationMobile from "@/components/card/CardAnimationMobile";
import TypewriterText from "@/components/effect/typewriter_gpt_style";
import { Button } from "@/components/ui/button";
import { LinkedinIcon, Mail, FileUser, Github } from "lucide-react";
import { useState } from "react";
import CardAnimationDesktop from "../components/card/CardAnimationDesktop";

export default function Home() {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 建立檢查函式
    function checkScreenSize() {
      setIsMobile(window.innerWidth < 1000);
    }
    // 進入頁面先檢查一次
    checkScreenSize();

    // 監聽 resize 事件
    window.addEventListener("resize", checkScreenSize);

    // 組件卸載時移除監聽
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // 依照 isMobile 狀態，決定要渲染哪個卡片組件
  const CardComponent = isMobile ? CardAnimationMobile : CardAnimationDesktop;

  const [isLinkedinHovered, setIsLinkedinHovered] = useState(false);
  const [isResumeHovered, setIsResumeHovered] = useState(false);
  const [isGithubHovered, setIsGithubHovered] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);

  return (
    <div className="w-screen h-screen relative flex">
      {/* Card Animation - Full Screen (Left) */}
      <div className="z-0 absolute top-0 left-0 w-full h-full">
        <CardComponent />
      </div>

      {/* Social Buttons - Floating on right side */}
      <div className={`absolute ${isMobile ? "top-1/2 right-0" : "top-1/2 right-1/3"} z-10`}
        style={isMobile ? { transform: "translateY(-50%)" } : { transform: "translate(50%, -50%)" }}
      >
        {!isMobile && <div className="flex flex-col space-y-4 mb-8">
          <TypewriterText
            text="Hello, I'm 陳德生"
            className="text-3xl font-bold"
          />
          <TypewriterText
            text="I'm a software engineer"
            className="text-3xl font-bold"
          />
        </div>}

        <div className={`flex ${isMobile ? "flex-col space-y-6" : "space-x-6"}`}>
          <Button
            className={`${isMobile
              ? "px-5 py-3 w-14 h-14 shadow-lg "
              : "mb-4"
              } cursor-pointer  ${isMobile ? "rounded-r-none" : ""} flex items-center justify-center`}
            href="https://www.linkedin.com/in/doeshing/"
            onMouseEnter={() => setIsLinkedinHovered(true)}
            onMouseLeave={() => setIsLinkedinHovered(false)}
          >
            <LinkedinIcon size={isMobile ? 30 : 24} className="text-white" />
          </Button>
          <Button
            className={`${isMobile
              ? "px-5 py-3 w-14 h-14 shadow-lg"
              : "mb-4"
              } cursor-pointer  ${isMobile ? "rounded-r-none" : ""} flex items-center justify-center`}
            href="/resume.pdf"
            onMouseEnter={() => setIsResumeHovered(true)}
            onMouseLeave={() => setIsResumeHovered(false)}
          >
            <FileUser size={isMobile ? 30 : 24} className="text-white" />
          </Button>
          <Button
            className={`${isMobile
              ? "px-5 py-3 w-14 h-14 shadow-lg "
              : "mb-4"
              } cursor-pointer  ${isMobile ? "rounded-r-none" : ""} flex items-center justify-center`}
            href=""
            onMouseEnter={() => setIsGithubHovered(true)}
            onMouseLeave={() => setIsGithubHovered(false)}
          >
            <Github size={isMobile ? 30 : 24} className="text-white" />
          </Button>
          <Button
            className={`${isMobile
              ? "py-3 w-14 h-14 shadow-lg"
              : "mb-4"
              } cursor-pointer  ${isMobile ? "rounded-r-none" : ""} flex items-center justify-center`}
            href="mailto:contact@doeshinf.ink"
            onMouseEnter={() => setIsEmailHovered(true)}
            onMouseLeave={() => setIsEmailHovered(false)}
          >
            <Mail size={isMobile ? 30 : 24} className="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}