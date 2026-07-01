import type { ReactNode } from "react";

type WowSectionProps = {
  children: ReactNode;
  animation?: string;
  delay?: string;
  duration?: string;
  className?: string;
};

const WowSection = ({
  children,
  animation = "fadeInUp",
  delay = ".2s",
  duration = ".9s",
  className = "",
}: WowSectionProps) => {
  const classes = ["wow", animation, className].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      data-wow-delay={delay}
      data-wow-duration={duration}
    >
      {children}
    </div>
  );
};

export default WowSection;
