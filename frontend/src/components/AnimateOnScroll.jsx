import React from "react";
import useInView from "../hooks/useInView";

export default function AnimateOnScroll({ children, className = "", once = true, threshold = 0.15 }) {
    const [ref, inView] = useInView({ once, threshold });

    return (
        <div ref={ref} className={`scroll-animate ${inView ? "in-view" : ""} ${className}`.trim()}>
            {children}
        </div>
    );
}
