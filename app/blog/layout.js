"use client";

import Sidebar from "@/components/blog/layout/Sidebar";
import RightSidebar from "@/components/blog/layout/RightSidebar";

export default function BlogLayout({ children }) {
  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex gap-6 py-8">
        {/* Left Sidebar */}
        <div className="w-[275px] xl:w-[300px] hidden md:block shrink-0">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 md:max-w-[600px] xl:max-w-[600px] border-x border-zinc-800">
          {children}
        </main>

        {/* Right Sidebar */}
        <div className="w-[350px] hidden xl:block shrink-0">
          <div className="sticky top-20">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}