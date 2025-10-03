import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`bg-clip-text text-transparent inline-block ${
        disabled ? "" : "animate-shine"
      } ${className}`}
      style={{
        backgroundImage: "linear-gradient(to right, #334155, #64748b, #334155)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        animation: disabled
          ? "none"
          : `shine ${animationDuration} linear infinite`,
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
