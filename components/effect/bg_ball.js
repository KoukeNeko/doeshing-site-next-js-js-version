"use client";
import { useEffect, useState } from "react";

/**
 * BgBall 元件 - 創建一個浮動彩色球體的背景動畫效果
 * 使用 Web Animations API 產生隨機移動的球體
 * 球體會與左上角的微妙漸層光源產生互動
 * 回傳 null，因為這僅是一個 Side Effect 元件，不直接渲染任何視覺內容
 */

export default function BgBall() {

  const [isMobile, setIsMobile] = useState(false);

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


  useEffect(() => {
    // 建立一個容器作為固定背景
    const container = document.createElement("div");
    container.id = "bg-ball-container";     // 定義容器 ID
    container.style.position = "fixed";     // 固定位置
    container.style.top = "0";              // 從頂部開始
    container.style.left = "0";             // 從左側開始
    container.style.width = "100vw";        // 寬度為視窗寬度
    container.style.height = "100vh";       // 高度為視窗高度
    container.style.overflow = "hidden";    // 隱藏超出容器的內容
    container.style.zIndex = "-1";          // 確保在背景層級
    container.style.pointerEvents = "none"; // 允許點擊穿透背景
    
    // 添加微妙的白色漸層，只在左上角
    container.style.background = "radial-gradient(circle at top left, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 40%)";
    
    document.body.appendChild(container);   // 將容器新增到 body 中

    // 定義球體的顏色選項
    const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];
    const numBalls = isMobile ? 30 : 50;                    // 球體總數
    const balls = [];                       // 用於存儲所有球體元素的陣列

    // 創建球體並添加到容器中
    for (let i = 0; i < numBalls; i++) {
      const ball = document.createElement("div");
      ball.classList.add("ball");           // 新增 CSS 名稱
      ball.style.background = colors[Math.floor(Math.random() * colors.length)]; // 隨機顏色
      ball.style.position = "absolute";     // 絕對定位
      ball.style.left = `${Math.floor(Math.random() * 100)}vw`; // 隨機水平位置
      ball.style.top = `${Math.floor(Math.random() * 100)}vh`;  // 隨機垂直位置
      ball.style.transform = `scale(${Math.random()})`;         // 隨機縮放
      ball.style.width = `${Math.random()}em`;                  // 隨機寬度
      ball.style.height = ball.style.width;                     // 等比例高度
      
      // 添加混合模式，使球體在光源處變亮
      ball.style.mixBlendMode = "screen";   // 使用 screen 混合模式使球體在接近光源時變亮
      
      // 添加圓角使球體更圓滑
      ball.style.borderRadius = "50%";
      
      // 稍微添加一些透明度
      ball.style.opacity = "0.8";

      balls.push(ball);                     // 將球體加入陣列
      container.appendChild(ball);          // 將球體添加到容器
    }

    // 使用 Web Animations API 為每個球體添加動畫
    balls.forEach((el, i) => {
      // 計算隨機移動目標位置
      const to = {
        x: Math.random() * (i % 2 === 0 ? -11 : 11), // 奇偶數決定左右方向
        y: Math.random() * 12                        // 垂直移動範圍
      };
      
      // 應用動畫效果：從原點到隨機位置
      el.animate(
        [
          { transform: "translate(0, 0)" },                     // 起始位置
          { transform: `translate(${to.x}rem, ${to.y}rem)` }    // 目標位置
        ],
        {
          duration: (Math.random() + 1) * 2000, // 隨機持續時間 (2-4秒)
          direction: "alternate",               // 來回交替動畫
          fill: "both",                         // 保持動畫結束狀態
          iterations: Infinity,                 // 無限循環
          easing: "ease-in-out"                 // 緩入緩出效果
        }
      );
    });

    // 當元件unload時清理容器
    return () => {
      container.remove(); // 從 DOM 中移除容器
    };
  }, [isMobile]); // 添加 isMobile 作為依賴項，當螢幕尺寸改變時重新創建球體

  return null; // 元件本身不渲染任何內容
}