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
    { icon: Mail, href: "mailto:contact@doeshinf.ink" }
  ];

  return (
    <div className="w-screen h-dvh relative flex overflow-visible max-w-7xl">
      <div className="z-0 absolute top-0 left-0 w-full h-full">
        <CardComponent />
      </div>

      <div
        className={`absolute ${isMobile ? "top-1/2 right-0" : "top-1/2 right-1/3"} z-10`}
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
  );
}