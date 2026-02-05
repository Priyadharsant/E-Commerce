import React from "react";

export default function LoadingSpinner({ size = "md", className = "", label = "Loading" }) {
    const cls = `loading-spinner ${size} ${className}`.trim();
    return (
        <div className="Loader">
            <div role="status" aria-live="polite" aria-label={label} className={cls}>
                <span className="visually-hidden">{label}</span>
                <div className="spinner" />
            </div>
            loading...
        </div>
    );
}
