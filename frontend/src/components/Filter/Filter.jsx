import React, { useState, useEffect } from "react";
import { apiUrl, ENDPOINTS } from "../../config/api";
import Header from "../Header";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";

function Filter() {
    const [searchParams] = useSearchParams();

    const price = searchParams.get("price");
    const filter = searchParams.get("filter") || "all";
    const rating = searchParams.get("rating");
    const discount = searchParams.get("discount");
    const [categories, setCategories] = useState({});

    useEffect(() => {
        if (!filter) return;

        fetch(apiUrl(`${ENDPOINTS.FILTER}?category=${encodeURIComponent(filter)}`))
            .then(res => res.json())
            .then(data => {
                let result = {};

                Object.keys(data.data).forEach(categoryName => {
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
            })
            .catch(err => console.error(err));

    }, [filter, price, rating, discount]);

    return (
        <>
            <Header />
            <main>
                {Object.keys(categories).length === 0 && (
                    <p className="noProducts">No products found</p>
                )}


                {Object.keys(categories).map(categoryName => (
                    <div key={categoryName} className="filterContainer">
                        <h2>{categoryName}</h2>

                        <div className={`filterProducts ${filter === "all" ? "Multi" : ""}`}>
                            {categories[categoryName].map(product => (
                                <ProductCard
                                    key={product._id}
                                    {...product}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </main>
        </>
    );
}

export default Filter;
