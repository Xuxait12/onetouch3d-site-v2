"use client";
 
import * as React from "react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
 
type InfiniteTextMarqueeProps = {
  text?: string;
  link?: string;
  speed?: number;
  showTooltip?: boolean;
  tooltipText?: string;
  fontSize?: string;
  textColor?: string;
  hoverColor?: string;
};
 
export const InfiniteTextMarquee: React.FC<InfiniteTextMarqueeProps> = ({
  text = "Clique para ampliar",
  link = "/",
  speed = 30,
  showTooltip = true,
  tooltipText = "Time to Flex💪",
  fontSize = "8rem",
  textColor = "", // optional override
  hoverColor = "", // optional override
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const maxRotation = 8;
 
  useEffect(() => {
    if (!showTooltip) return;
 
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
 
      const midpoint = window.innerWidth / 2;
      const distanceFromMidpoint = Math.abs(e.clientX - midpoint);
      const rotation = (distanceFromMidpoint / midpoint) * maxRotation;
 
      setRotation(e.clientX > midpoint ? rotation : -rotation);
    };
 
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showTooltip]);
 
  return (
    <>
      {showTooltip && (
        <div
          className={`following-tooltip fixed z-[99] transition-opacity duration-300 font-bold px-12 py-6 rounded-3xl text-nowrap
            ${isHovered ? "opacity-100" : "opacity-0"}
            bg-primary text-primary-foreground
          `}
          style={{
            top: `${cursorPosition.y}px`,
            left: `${cursorPosition.x}px`,
            transform: `rotateZ(${rotation}deg) translate(-50%, -140%)`,
          }}
        >
          <p>{tooltipText}</p>
        </div>
      )}

      <div className="w-full flex justify-center overflow-hidden py-4">
        <motion.div
          className="inline-block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            x: [-20, 20, -20],
            transition: {
              repeat: Infinity,
              duration: speed / 10,
              ease: "easeInOut",
            },
          }}
        >
          <Link to={link}>
            <span
              className={`cursor-pointer font-bold tracking-tight transition-all inline-block ${
                textColor ? "" : "text-foreground"
              }`}
              style={{
                fontSize,
                color: textColor || undefined,
              }}
            >
              <span className="hoverable-text">{text}</span>
              <style>{`
                .hoverable-text:hover {
                  color: ${hoverColor || "hsl(var(--primary))"};
                }
              `}</style>
            </span>
          </Link>
        </motion.div>
      </div>
    </>
  );
};