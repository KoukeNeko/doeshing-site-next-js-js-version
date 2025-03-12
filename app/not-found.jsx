import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [dotCount, setDotCount] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => prev < 3 ? prev + 1 : 1);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="construction-container">
      <div className="construction-scene">
        <div className="digger">
          <div className="digger-body">🚜</div>
          <div className="digger-arm">💪</div>
        </div>
        
        <div className="tools">
          <span className="tool hammer">🔨</span>
          <span className="tool wrench">🔧</span>
          <span className="tool drill">🪛</span>
        </div>
        
        <div className="dust-particles">
          <span>✨</span>
          <span>💨</span>
          <span>✨</span>
        </div>
      </div>
      
      <h1 className="construction-title">404 - Page Not Found</h1>
      <h2 className="construction-subtitle">
        Under Construction{Array(dotCount).fill('.').join('')}
      </h2>
      <p className="construction-message">
        We're building something amazing here! Please check back later.
      </p>
      <div className="progress-bar">
        <div className="progress-fill"></div>
      </div>
      <Link href="/" className="home-button">Return to Home</Link>
      
      <style jsx>{`
        .construction-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f5f5f5;
          font-family: 'Arial', sans-serif;
          text-align: center;
          padding: 2rem;
        }

        .construction-scene {
          position: relative;
          width: 300px;
          height: 200px;
          margin-bottom: 2rem;
        }

        .digger {
          position: absolute;
          bottom: 20px;
          left: 50px;
          transform-origin: bottom center;
          animation: bounce 2s infinite;
        }

        .digger-body {
          font-size: 4rem;
          transform: scaleX(-1);
        }

        .digger-arm {
          position: absolute;
          top: 10px;
          right: 0;
          font-size: 2rem;
          transform-origin: left center;
          animation: dig 1.5s infinite;
        }

        .tools {
          position: absolute;
          top: 50px;
          right: 50px;
        }

        .tool {
          font-size: 2.5rem;
          position: absolute;
          opacity: 0;
        }

        .hammer {
          animation: rotate 3s infinite 0.5s;
        }

        .wrench {
          animation: rotate 3s infinite 1s;
          left: 30px;
        }

        .drill {
          animation: rotate 3s infinite 1.5s;
          left: 60px;
        }

        .dust-particles {
          position: absolute;
          bottom: 30px;
          right: 80px;
        }

        .dust-particles span {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0;
          animation: float 3s infinite;
        }

        .dust-particles span:nth-child(2) {
          animation-delay: 1s;
          left: 20px;
        }

        .dust-particles span:nth-child(3) {
          animation-delay: 2s;
          left: 40px;
        }

        .construction-title {
          font-size: 2.5rem;
          color: #e74c3c;
          margin-bottom: 0.5rem;
        }

        .construction-subtitle {
          font-size: 2rem;
          color: #3498db;
          margin-bottom: 1rem;
        }

        .construction-message {
          font-size: 1.2rem;
          color: #555;
          margin-bottom: 2rem;
        }

        .progress-bar {
          width: 300px;
          height: 20px;
          background-color: #eee;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .progress-fill {
          height: 100%;
          width: 30%;
          background-color: #2ecc71;
          animation: progress 8s infinite;
        }

        .home-button {
          padding: 12px 24px;
          background-color: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 25px;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .home-button:hover {
          background-color: #2980b9;
          transform: scale(1.05);
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0) scaleX(-1); }
          50% { transform: translateY(-10px) scaleX(-1); }
        }

        @keyframes dig {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(30deg); }
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); opacity: 0; }
          25% { opacity: 1; }
          50% { transform: rotate(360deg); opacity: 1; }
          75% { opacity: 0; }
          100% { transform: rotate(0deg); opacity: 0; }
        }

        @keyframes float {
          0% { transform: translateY(0); opacity: 0; }
          25% { opacity: 1; }
          50% { transform: translateY(-30px); opacity: 1; }
          75% { opacity: 0; }
          100% { transform: translateY(-60px); opacity: 0; }
        }

        @keyframes progress {
          0% { width: 10%; }
          50% { width: 70%; }
          70% { width: 60%; }
          100% { width: 90%; }
        }

        @media (max-width: 768px) {
          .construction-scene {
            transform: scale(0.8);
          }
          
          .construction-title {
            font-size: 2rem;
          }
          
          .construction-subtitle {
            font-size: 1.7rem;
          }
        }
      `}</style>
    </div>
  );
}