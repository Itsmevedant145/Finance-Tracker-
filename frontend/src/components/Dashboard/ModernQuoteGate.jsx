import React, { useState, useEffect, useRef } from 'react';

const ModernQuoteGate = ({ onUnlock }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false); // To track fading state
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  // Quotes mapped to each day of the week (Sunday = 0, Saturday = 6)
  const weeklyQuotes = [
    {
      quote: "Wealth is not about having a lot of money; it's about having a lot of options.",
      author: "Chris Rock"
    },
    {
      quote: "The price of anything is the amount of life you exchange for it.",
      author: "Henry David Thoreau"
    },
    {
      quote: "It's not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.",
      author: "Robert Kiyosaki"
    },
    {
      quote: "Financial freedom is available to those who learn about it and work for it.",
      author: "Robert Kiyosaki"
    },
    {
      quote: "The goal isn't more money. The goal is living life on your own terms.",
      author: "Chris Brogan"
    },
    {
      quote: "Don't tell me what you value, show me your budget, and I'll tell you what you value.",
      author: "Joe Biden"
    },
    {
      quote: "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
      author: "Ayn Rand"
    }
  ];

  const dayOfWeek = new Date().getDay();
  const todayQuote = weeklyQuotes[dayOfWeek];

  // Color palette mapped to each day
  const dayColors = {
    0: "#2C3E50", // Sunday
    1: "#2980B9", // Monday
    2: "#8E44AD", // Tuesday
    3: "#34495E", // Wednesday
    4: "#1ABC9C", // Thursday
    5: "#E74C3C", // Friday
    6: "#F39C12"  // Saturday
  };

  const primaryColor = dayColors[dayOfWeek];

  useEffect(() => {
    const duration = 2500; // 2.5 seconds to match Home component

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsedTime = timestamp - startTimeRef.current;
      
      // Calculate progress (0-100)
      const newProgress = Math.min((elapsedTime / duration) * 100, 100);
      setProgress(newProgress);
      
      // Continue animation or complete
      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete - trigger fade out after reaching 100%
        setIsFading(true); // This will trigger the fade-out effect
        setTimeout(() => {
          onUnlock?.(); // Unlock action after fade-out
        }, 500); // Reduced delay (500ms) to make the transition feel faster
      }
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // Empty dependency array ensures this only runs once

  return (
    <div className={`flex justify-center items-center h-screen bg-gradient-to-b from-gray-800 to-gray-900 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-4/5 max-w-2xl p-8 text-center relative bg-transparent">
        {/* Loading Bars Container */}
        <div className="flex justify-between items-center mb-6 mt-4 relative">
          {/* Left Progress Bar */}
          <div className="h-2 bg-gray-700 rounded-full w-5/12 overflow-hidden relative">
            <div 
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${progress}%`,
                backgroundColor: primaryColor,
                borderRadius: '999px',
                boxShadow: `0 0 8px ${primaryColor}`
              }}
            ></div>
          </div>
          
          {/* Percentage Display */}
          <div className="text-sm font-mono mx-2 w-16 text-center" style={{ color: primaryColor }}>
            {Math.round(progress)}%
          </div>
          
          {/* Right Progress Bar */}
          <div className="h-2 bg-gray-700 rounded-full w-5/12 overflow-hidden relative">
            <div 
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                height: '100%',
                width: `${progress}%`,
                backgroundColor: primaryColor,
                borderRadius: '999px',
                boxShadow: `0 0 8px ${primaryColor}`
              }}
            ></div>
          </div>
        </div>

        {/* Daily Quote */}
        <p className="text-3xl italic font-semibold text-gray-300 leading-relaxed mb-4">
          "{todayQuote.quote}"
        </p>

        {/* Author and Date */}
        <div className="text-lg text-gray-400">
          <p className="font-bold">{todayQuote.author}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernQuoteGate;
