import React, { useEffect, useRef, useState } from "react";
import styles from "./Fade.module.css";

export type FadeDirection =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "scale-up"
    | "scale-down"
    | "opacity-only";

interface FadeInProps {
    children: React.ReactNode;
    direction?: FadeDirection;
    delay?: number;
    duration?: number;
    triggerOnView?: boolean;
    className?: string;

    opacityFrom?: number;
    opacityTo?: number;
    opacityDuration?: number;
    opacityDelay?: number;
}

const directionClassMap: Record<FadeDirection, string> = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
    "top-left": "topLeft",
    "top-right": "topRight",
    "bottom-left": "bottomLeft",
    "bottom-right": "bottomRight",
    "scale-up": "scaleUp",
    "scale-down": "scaleDown",
    "opacity-only": "opacityOnly",
};

const FadeIn: React.FC<FadeInProps> = ({
    children,
    direction = "top",
    delay = 0,
    duration = 500,
    triggerOnView = false,
    className = "",
    opacityFrom = 0,
    opacityTo = 1,
    opacityDuration,
    opacityDelay,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // ✅ Start hidden always
    const [isVisible, setIsVisible] = useState(false);

    // ✅ If not triggerOnView, reveal after mount so animation runs
    useEffect(() => {
        if (triggerOnView) return;
        const id = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(id);
    }, [triggerOnView]);

    // ✅ Intersection observer path
    useEffect(() => {
        if (!triggerOnView) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [triggerOnView]);

    const dirKey = directionClassMap[direction];

    // ✅ Always include direction class; visible overrides transform
    const containerClasses = [
        styles.fadeContainer,
        styles[dirKey],
        isVisible ? styles.visible : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const inlineStyles: React.CSSProperties = {
        transition: `opacity ${opacityDuration ?? duration}ms ease-out ${opacityDelay ?? delay}ms, transform ${duration}ms ease-out ${delay}ms`,
        opacity: isVisible ? opacityTo : opacityFrom,
    };

    return (
        <div ref={containerRef} className={containerClasses} style={inlineStyles}>
            {children}
        </div>
    );
};

export default FadeIn;
