"use client";

import { useState, useEffect } from 'react';
import { Smartphone, RotateCw } from 'lucide-react';

function OrientationLock() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Logic: If width > height, it's landscape. 
      // Only show on mobile/tablets (width < 1024px).
      const landscape = window.innerWidth > window.innerHeight && window.innerWidth < 1024;
      setIsLandscape(landscape);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  if (!isLandscape) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-900 flex flex-col items-center justify-center text-white p-8 text-center backdrop-blur-md">
      {/* Animated Icon Area */}
      <div className="relative mb-10">
        {/* Subtle background ring */}
        <div className="absolute inset-0 scale-150 opacity-10">
            <RotateCw className="w-full h-full animate-spin-slow" />
        </div>
        
        {/* The Main Phone Icon with custom animation */}
        <Smartphone className="w-20 h-20 text-[#4CAF50] animate-[phone-rotate_2.5s_infinite_ease-in-out]" />
        
        {/* Secondary indicator icon */}
        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1.5 shadow-lg">
          <RotateCw className="w-5 h-5 text-yellow-900 animate-spin" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-3 tracking-tight">Rotate Your Device</h2>
      <p className="text-slate-400 max-w-[260px] leading-relaxed">
        This game is designed for <b>Portrait Mode</b>. Please turn your phone for the best experience.
      </p>

      {/* Tailwind Animation definitions */}
      <style jsx global>{`
        @keyframes phone-rotate {
          0% { transform: rotate(90deg); }
          30% { transform: rotate(0deg); }
          70% { transform: rotate(0deg); }
          100% { transform: rotate(90deg); }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export { OrientationLock };