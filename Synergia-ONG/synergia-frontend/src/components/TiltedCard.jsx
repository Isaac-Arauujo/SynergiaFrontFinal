import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./TiltedCard.css";

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 0.5
};

export default function TiltedCard({ 
  children, 
  className = "", 
  scaleOnHover = 1.05,
  rotateAmplitude = 10,
  enableTilt = true
}) {
  const cardRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(mouseY, springValues);
  const rotateY = useSpring(mouseX, springValues);

  function handleMouseMove(e) {
    if (!enableTilt) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    const rotateYValue = ((mouseXPos - width / 2) / width) * rotateAmplitude;
    const rotateXValue = ((mouseYPos - height / 2) / height) * rotateAmplitude;

    mouseX.set(rotateYValue);
    mouseY.set(-rotateXValue);
  }

  function handleMouseEnd() {
    if (!enableTilt) return;
    
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }

  function handleMouseStart() {
    setIsHovered(true);
  }

  return (
    <motion.div
      ref={cardRef}
      className={`tilted-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseEnd}
      onMouseEnter={handleMouseStart}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        scale: isHovered && enableTilt ? scaleOnHover : 1,
        transformStyle: "preserve-3d",
      }}
      whileHover={enableTilt ? { scale: scaleOnHover } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}