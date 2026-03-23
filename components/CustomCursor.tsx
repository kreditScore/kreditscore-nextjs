'use client';

import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClicking, setIsClicking] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Update mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Smooth follow animation using requestAnimationFrame
    const animateCursor = () => {
      // Smooth follow for outer circle (0.15 factor)
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

      // Faster follow for dot (0.25 factor)
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.25;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.25;

      // Update DOM positions
      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorPos.current.x}px`;
        cursorRef.current.style.top = `${cursorPos.current.y}px`;
      }

      if (dotRef.current) {
        dotRef.current.style.left = `${dotPos.current.x}px`;
        dotRef.current.style.top = `${dotPos.current.y}px`;
      }

      requestAnimationFrame(animateCursor);
    };

    // Click animations
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Hide/show cursor when leaving/entering window
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Start animation loop
    const animationId = requestAnimationFrame(animateCursor);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor circle */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isClicking ? 'clicking' : ''}`}
      />

      {/* Cursor dot */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
      />
    </>
  );
};

export default CustomCursor;
