import React, { useState, useEffect } from "react";
import { ENDPOINTS } from "../../config/api";
import { fetchJson } from "../../utils/api";
import { userMessageFromError, logError } from "../../utils/errorHandler";
import LoadingSpinner from "../LoadingSpinner";
import Header from "../Header";
import { useSearchParams } from "react-router-dom";
import FilterSection from "./FilterSection";
import Pop from "../Popup";

function Filter() {
    const [searchParams] = useSearchParams();

    const price = searchParams.get("price");
    const filter = searchParams.get("filter") || "all";
    const rating = searchParams.get("rating");
    const discount = searchParams.get("discount");
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, SetSuccess] = useState(false);
    function Popfunc() {
        SetSuccess(true)
        setTimeout(() => {
            SetSuccess(false)
        }, 5000)
    }
    useEffect(() => {
        if (!filter) return;

        (async function load() {
            setLoading(true);
            setError("");
            try {
                const data = await fetchJson(`${ENDPOINTS.FILTER}?category=${encodeURIComponent(filter)}`);
                let result = {};

                Object.keys(data.data || {}).forEach(categoryName => {
                    let products = [...data.data[categoryName]];

                    if (price === "asc") {
                        products.sort((a, b) => a.price - b.price);
                    }
                    if (price === "desc") {
                        products.sort((a, b) => b.price - a.price);
                    }

                    if (rating) {
                        products = products.filter(
                            p => Number(p.rating) >= Number(rating)
                        );
                    }

                    if (discount) {
                        products = products.filter(
                            p => Number(p.off) >= Number(discount)
                        );
                    }

                    if (products.length > 0) {
                        result[categoryName] = products;
                    }
                });

                setCategories(result);
            } catch (err) {
                logError(err, { source: "Filter:load" });
                setCategories({});
                setError(userMessageFromError(err));
            } finally {
                setLoading(false);
            }
        })();

    }, [filter, price, rating, discount]);

    return (
        <>
            <Header />
            <main>
                {loading && (
                    <div style={{ width: "100%", textAlign: "center", padding: "1rem" }}>
                        <LoadingSpinner />
                    </div>
                )}
                {error && <p className="error">{error}</p>}

                {!loading && Object.keys(categories).length === 0 && (
                    <p className="noProducts">No products found</p>
                )}

                {Object.keys(categories).map(categoryName => (
                    <FilterSection
                        key={categoryName}
                        categoryName={categoryName}
                        products={categories[categoryName]}
                        filter={filter}
                        PopUp={Popfunc}

                    />
                ))}
            </main>
            <Pop success={success} />
        </>
    );
}

export default Filter;
