"use client";

import { useEffect, useState } from "react";
import CardAnimationMobile from "@/components/card/CardAnimationMobile";
import CardAnimationDesktop from "@/components/card/CardAnimationDesktop";
import TypewriterText from "@/components/effect/typewriter_gpt_style";
import SocialButton from "@/components/buttons/SocialButton";
import { LinkedinIcon, Mail, FileUser, Github } from "lucide-react";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLinkedinHovered, setIsLinkedinHovered] = useState(false);
  const [isResumeHovered, setIsResumeHovered] = useState(false);
  const [isGithubHovered, setIsGithubHovered] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);

  useEffect(() => {
    function checkScreenSize() {
      setIsMobile(window.innerWidth < 1000);
    }

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const CardComponent = isMobile ? CardAnimationMobile : CardAnimationDesktop;

  const socialButtons = [
    {
      icon: LinkedinIcon,
      href: "https://www.linkedin.com/in/doeshing/",
      setHovered: setIsLinkedinHovered
    },
    {
      icon: FileUser,
      href: "/resume.pdf",
      setHovered: setIsResumeHovered
    },
    {
      icon: Github,
      href: "https://github.com/KoukeNeko",
      setHovered: setIsGithubHovered
    },
    {
      icon: Mail,
      href: "mailto:contact@doeshinf.ink",
      setHovered: setIsEmailHovered
    }
  ];

  return (
    <div className="w-screen h-dvh relative flex">
      {/* Card Animation - Full Screen */}
      <div className="z-0 absolute top-0 left-0 w-full h-full">
        <CardComponent />
      </div>

      {/* Social Buttons Section */}
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

        {/* Social Buttons */}
        <div className={`flex ${isMobile ? "flex-col space-y-6" : "space-x-6"}`}>
          {socialButtons.map((button, index) => (
            <SocialButton
              key={index}
              icon={button.icon}
              href={button.href}
              isMobile={isMobile}
              onHoverChange={button.setHovered}
            />
          ))}
        </div>
      </div>
    </div>
  );
}