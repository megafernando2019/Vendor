"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "react-intersection-observer";

type AnimateOnScrollProps = {
  children: ReactNode;
  animation?: string;
  className?: string;
  delay?: string;
  duration?: string;
  style?: CSSProperties;
};

const AnimateOnScroll = ({
  children,
  animation = "fadeInUp",
  className = "",
  delay,
  duration,
  style,
}: AnimateOnScrollProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.08,
    rootMargin: "0px 0px -60px 0px",
  });

  const animationStyle: CSSProperties = { ...style };
  if (delay) animationStyle.animationDelay = delay;
  if (duration) animationStyle.animationDuration = duration;

  return (
    <div
      ref={ref}
      className={`${className}${inView ? ` animated ${animation}` : ""}`.trim()}
      style={animationStyle}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;
