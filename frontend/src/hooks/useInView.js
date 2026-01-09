import { useEffect, useRef, useState } from "react";

export default function useInView(options = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setInView(true);
                    if (options.once) observer.unobserve(el);
                } else {
                    if (!options.once) setInView(false);
                }
            },
            { threshold: options.threshold ?? 0.15 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [options.once, options.threshold]);

    return [ref, inView];
}
