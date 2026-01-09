import React from "react";
import { logError } from "../utils/errorHandler";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        logError(error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                    <h2>Something went wrong.</h2>
                    <p>Try refreshing the page. If the problem persists, contact support.</p>
                </div>
            );
        }

        return this.props.children;
    }
}
