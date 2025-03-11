import { useState, useEffect, useRef, useCallback } from "react";

const TypewriterText = ({
  text,
  delay = 0,
  className = "",
  typingDelay = 5,
  randomVariation = 15,
  showCursor = true,
  cursor = "⬤",
  cursorColor = "text-zinc-300",
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const timeoutRef = useRef(null);
  const textRef = useRef(text);
  const currentIndexRef = useRef(0);

  // 使用 useCallback 確保函數不會在每次渲染時重新創建
  const typeNextChar = useCallback(() => {
    if (currentIndexRef.current <= textRef.current.length) {
      setDisplayText(textRef.current.slice(0, currentIndexRef.current));
      currentIndexRef.current++;

      const randomDelay = typingDelay + Math.random() * randomVariation;
      timeoutRef.current = setTimeout(typeNextChar, randomDelay);
    } else {
      setIsTypingComplete(true);
    }
  }, [typingDelay, randomVariation]);

  // 監聽 text 變化
  useEffect(() => {
    textRef.current = text;
    currentIndexRef.current = 0;
    setIsTypingComplete(false);
    setDisplayText("");
  }, [text]);

  // 處理打字效果
  useEffect(() => {
    // 清除之前的計時器
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(typeNextChar, delay);

    // 組件卸載時清除計時器
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay, typeNextChar, text]);

  return (
    <span className={className}>
      <span
        className={`transition-opacity duration-200 ${
          isTypingComplete ? "opacity-100" : "opacity-80"
        }`}
      >
        {displayText}
      </span>
      {!isTypingComplete && showCursor && (
        <span className="inline-block ml-1">
          <span
            className={`${cursorColor} animate-pulse block`}
            style={{
              fontSize: "0.8em",
              lineHeight: 1,
              verticalAlign: "middle",
              marginTop: "-2px",
            }}
          >
            {cursor}
          </span>
        </span>
      )}
    </span>
  );
};

export default TypewriterText;
