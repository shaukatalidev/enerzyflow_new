"use client";

import { useEffect } from "react";

const CustomCursor = () => {
  useEffect(() => {
    const dot = document.querySelector(".cursor-dot") as HTMLElement;
    const outline = document.querySelector(".cursor-outline") as HTMLElement;

    if (!dot || !outline) return;

    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      dot.style.left = `${clientX}px`;
      dot.style.top = `${clientY}px`;

      outline.animate(
        {
          left: `${clientX}px`,
          top: `${clientY}px`,
        },
        { duration: 300, fill: "forwards" }
      );
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" />
      <div className="cursor-outline" />
    </>
  );
};

export default CustomCursor;
