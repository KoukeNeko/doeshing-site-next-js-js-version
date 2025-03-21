"use client";

import Sidebar from "@/components/blog/layout/Sidebar";
import RightSidebar from "@/components/blog/layout/RightSidebar";
import MobileNav from "@/components/blog/mobile/MobileNav";
import MobileSearch from "@/components/blog/mobile/MobileSearch";

export default function BlogLayout({ children }) {
  return (
    <div className="container max-w-7xl mx-auto relative min-h-[calc(100vh-theme(spacing.16))] flex flex-col">
      <MobileNav />
      <MobileSearch />
      <div className="flex justify-center gap-6 py-4 md:py-8 px-4 md:px-6 mt-0 md:mt-0 flex-1">
        {/* Left Sidebar */}
        <div className="w-[220px] xl:w-[240px] hidden md:block shrink-0">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full md:max-w-[600px] xl:max-w-[600px] border-x border-zinc-800">
          <div className="px-6 py-8">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="w-[280px] hidden xl:block shrink-0">
          <div className="sticky top-20">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}