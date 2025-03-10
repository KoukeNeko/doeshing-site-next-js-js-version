import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function Footer(isSticky = true) {
  return (
    <footer
      className={`h-16 text-xs sm:text-sm text-zinc-600 border-t border-zinc-800/50 ${
        isSticky ? "flex-none" : ""
      }`}
    >
      <div className="h-full max-w-7xl mx-auto px-4">
        <div className="h-full flex justify-between items-center">
          {/* Left side content */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-2">
              <span>{new Date().getFullYear()}</span>
              <span className="hidden sm:inline">|</span>
              <span>Copyright {new Date().getFullYear()}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">|</span>
              <span>Inspired by Hello Friend NG</span>
              <span className="hidden sm:inline">|</span>
            </div>

            <div className="flex items-center">
              <span className="whitespace-nowrap">
                Made with <span className="text-red-500 mx-1">♥</span> by
                doeshing
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
