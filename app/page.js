"use client";
import { useEffect, useState } from "react";
import CardAnimationMobile from "@/components/card/CardAnimationMobile";
import CardAnimationDesktop from "@/components/card/CardAnimationDesktop";
import SocialButton from "@/components/buttons/SocialButton";
import { LinkedinIcon, Mail, FileUser, Github } from "lucide-react";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    function checkScreenSize() {
      setIsMobile(window.innerWidth < 1000);
    }
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    setInitialized(true);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (!initialized) return null; // hide content until setup finishes

  const CardComponent = isMobile ? CardAnimationMobile : CardAnimationDesktop;
  const socialButtons = [
    { icon: LinkedinIcon, href: "https://www.linkedin.com/in/doeshing/" },
    { icon: FileUser, href: "/resume.pdf" },
    { icon: Github, href: "https://github.com/KoukeNeko" },
    { icon: Mail, href: "mailto:contact@doeshing.ink" }
  ];

  return (
    <div className="w-screen h-dvh relative flex justify-center">
      {/* 卡片背景，設定為最大寬度，但確保可以溢出容器 */}
      <div className="absolute z-0 top-0 left-0 w-screen h-full overflow-visible pointer-events-auto">
        <CardComponent />
      </div>

      {/* 文字和按鈕內容，使用 pointer-events-none 確保點選事件透過到卡片 */}
      <div className="z-10 w-full max-w-7xl h-full relative pointer-events-none">
        {/* 使用 pointer-events-auto 確保按鈕仍可點選 */}
        <div
          className={`absolute ${isMobile ? "top-1/2 right-0" : "top-1/2 right-1/3"} pointer-events-auto`}
          style={isMobile ? { transform: "translateY(-50%)" } : { transform: "translate(50%, -50%)" }}
        >
          {!isMobile && (
            <div className="flex flex-col space-y-4 mb-8 transition-opacity duration-1000">
              <div className="text-3xl font-bold">Hello, I&rsquo;m 陳德生</div>
              <div className="text-3xl font-bold">I&rsquo;m a student who</div>
              <div className="text-3xl font-bold">studying CS at CCU.</div>
            </div>
          )}

          <div className={`flex ${isMobile ? "flex-col space-y-6" : "space-x-6"}`}>
            {socialButtons.map((button, index) => (
              <SocialButton key={index} icon={button.icon} href={button.href} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
