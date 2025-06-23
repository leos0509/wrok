import { useEffect, useRef, useState } from "react";

export function useIsOverflow<T extends HTMLElement = HTMLElement>(
  direction: "horizontal" | "vertical" = "vertical"
) {
  const ref = useRef<T>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const el = ref.current;
      if (!el) return;

      const hasOverflow =
        direction === "horizontal"
          ? el.scrollWidth > el.clientWidth
          : el.scrollHeight > el.clientHeight;

      setIsOverflow(hasOverflow);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [direction]);

  return { ref, isOverflow };
}
