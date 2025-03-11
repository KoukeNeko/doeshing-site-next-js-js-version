"use client";

import { Button } from "@/components/ui/button";

const SocialButton = ({ icon: Icon, href, isMobile, onHoverChange }) => {
  return (
    <a href={href}>
      <Button
        className={`
        ${
          isMobile ? "px-5 py-3 w-14 h-14 shadow-lg rounded-r-none" : "mb-4"
        } cursor-pointer flex items-center justify-center
      `}
        target="_blank"
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      >
        <Icon size={isMobile ? 30 : 24} className="text-white" />
      </Button>
    </a>
  );
};

export default SocialButton;
