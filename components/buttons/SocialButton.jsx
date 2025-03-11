import { Button } from "@/components/ui/button";

const SocialButton = ({ icon: Icon, href, isMobile, onHoverChange }) => {
  return (
    <div className={`${isMobile ? "" : "inline-block"}`}>
      <a href={href} className="block">
        <Button
          className={`
          ${
            isMobile ? "px-5 py-3 w-14 h-14 shadow-lg rounded-r-none" : "mb-4"
          } cursor-pointer flex items-center justify-center hover:shadow-[0_0_15px_rgba(255,255,255,0.7)] transition-all duration-300 ease-in-out transform-gpu ${
            isMobile
              ? "hover:scale-125 origin-right"
              : "hover:scale-125 origin-center"
          }
        `}
          target="_blank"
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
        >
          <Icon size={isMobile ? 30 : 24} className="text-white" />
        </Button>
      </a>
    </div>
  );
};

export default SocialButton;
