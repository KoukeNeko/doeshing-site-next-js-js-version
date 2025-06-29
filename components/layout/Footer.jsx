"use client";

import { usePathname } from "next/navigation";

function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <footer
      className={`h-16 text-xs sm:text-sm bg-zinc-950/20 border-t border-zinc-800/50 flex-none z-10 backdrop-blur-sm ${
        isHomePage ? "absolute bottom-0 w-full bg-transparent" : ""
      }`}
    >
      <div className="h-full max-w-7xl mx-auto px-4 flex sm:justify-between justify-center items-center">
        {/* Left side content */}
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-2">
            <span>
              Copyright {new Date().getFullYear()} All rights reserved.
            </span>
            <span className="hidden sm:inline">|</span>
          </div>

          <div className="flex items-center">
            <span className="whitespace-nowrap">
              Made with <span className="text-red-500 mx-1">♥</span> by doeshing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
