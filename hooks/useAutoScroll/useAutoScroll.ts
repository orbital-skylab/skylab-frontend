import { useEffect, useRef } from "react";

export default function useAutoScroll<T extends HTMLElement>(
  deps: readonly unknown[],
  options?: { threshold?: number }
) {
  const containerRef = useRef<T | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const threshold = options?.threshold ?? 120;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    // Only autoscroll if user is near bottom
    if (distanceFromBottom < threshold) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [threshold, deps]);

  return { containerRef, bottomRef };
}
