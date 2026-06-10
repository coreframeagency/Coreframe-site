"use client";

import { Children, cloneElement, isValidElement } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}

export function RevealOnScroll({
  children,
  className = "",
  stagger = false,
}: RevealOnScrollProps) {
  const ref = useScrollReveal<HTMLDivElement>();

  if (stagger) {
    const items = Children.toArray(children);

    return (
      <div
        ref={ref}
        className={`scroll-reveal scroll-reveal--stagger ${className}`.trim()}
      >
        {items.map((child, index) => {
          if (!isValidElement(child)) return child;

          return cloneElement(child, {
            key: child.key ?? index,
            className: `${(child.props as { className?: string }).className ?? ""} scroll-reveal__child`.trim(),
            style: {
              ...((child.props as { style?: React.CSSProperties }).style ?? {}),
              transitionDelay: `${index * 80}ms`,
            },
          } as React.Attributes);
        })}
      </div>
    );
  }

  return (
    <div ref={ref} className={`scroll-reveal ${className}`.trim()}>
      {children}
    </div>
  );
}
