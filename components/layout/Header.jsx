"use client";

import { Button } from "@/components/ui/button";
import {
  Menu,
  Signature,
  ReceiptText,
  Code,
  DoorOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VT323 } from "next/font/google";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const vt323 = VT323({
  weight: "400", // VT323 typically only has weight 400
  subsets: ["latin"],
});

export default function Header() {
  const pathname = usePathname();
  const [userPicture, setUserPicture] = useState("");
  const [userName, setUserName] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

  // Check authentication state when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          if (parsedUserInfo && parsedUserInfo.id) {
            setUserPicture(parsedUserInfo.picture || "");
            setUserName(parsedUserInfo.name || "");
            setIsAuthed(true);
          }
        } catch (error) {
          console.error("Error parsing user info:", error);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      setIsAuthed(false);
      setUserPicture("");
      setUserName("");
      window.location.href = "/";
    }
  };

  // Translations (hardcoded for this example)
  const t = (key) => {
    const translations = {
      helloWorld: "doeshing.site",
      blog: "部落格",
      project: "專案",
      about: "關於",
      profile: "個人資料",
      login: "登入",
      logout: "登出",
    };
    return translations[key] || key;
  };

  // Navigation items - centralized to avoid duplication
  const navItems = [
    {
      href: "/blog",
      icon: <ReceiptText className="mr-2" size={16} />,
      label: t("blog"),
      active: true, // external link won't be active in the current app
      isExternal: true,
    },
    {
      href: "/projects",
      icon: <Code className="mr-2" size={16} />,
      label: t("project"),
      active: pathname?.startsWith("/projects"),
    },
    {
      href: "/about",
      icon: <Signature className="mr-2" size={16} />,
      label: t("about"),
      active: pathname?.startsWith("/about"),
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/20 backdrop-blur-sm border-b border-zinc-800/50 z-50">
      <div className="h-full flex justify-between items-center max-w-7xl mx-auto px-4">
        <Link href="/" className="flex items-center space-x-1">
          <span
            className={
              "text-sm flex items-center opacity-100 " + vt323.className
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              transition: "opacity 0.3s ease",
            }}
          >
            &gt; {t("helloWorld")}
          </span>
          <span
            className="inline-flex items-center text-[8px] animate-cursor-blink"
            style={{ height: "12px", lineHeight: "0.6", overflow: "hidden" }}
          >
            ▌
            <style jsx>{`
              @keyframes blink {
                0%,
                100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0;
                }
              }
              .animate-cursor-blink {
                animation: blink 1s step-start infinite;
              }
            `}</style>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="link"
              className={`text-zinc-400 ${item.active ? "underline underline-offset-4" : ""}`}
              asChild
            >
              <Link 
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
              >
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-zinc-900/80 backdrop-blur-sm border-zinc-800/50 text-zinc-400"
            >
              
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-zinc-400 p-2">
                <Menu size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-zinc-900/80 backdrop-blur-sm border-zinc-800/50 text-zinc-400"
            >
              {navItems.map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link 
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}

              
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}