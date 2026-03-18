"use client";

import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "h-10" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/logo.png" 
        alt="BelaMarco Logo" 
        className="h-full w-auto object-contain"
        onError={(e) => {
          // Fallback si la imagen no existe aún
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.parentElement) {
            const text = document.createElement('span');
            text.className = "text-2xl font-black tracking-tight text-white";
            text.innerText = "BelaMarcoAPP";
            e.currentTarget.parentElement.appendChild(text);
          }
        }}
      />
    </div>
  );
};

export default Logo;