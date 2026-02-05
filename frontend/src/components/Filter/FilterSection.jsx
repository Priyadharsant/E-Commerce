import React from "react";
import ProductCard from "./ProductCard";
import useInView from "../../hooks/useInView";

export default function FilterSection({ categoryName, products, filter, PopUp }) {
    const [ref, inView] = useInView({ once: true, threshold: 0.05 });


    return (
        <div ref={ref} className={`filterContainer scroll-animate ${inView ? "in-view" : ""}`}>
            <h2>{categoryName}</h2>

            <div className={`filterProducts ${filter === "all" ? "Multi" : ""}`}>
                {products.map((product) => (
                    <ProductCard
                        key={product.slug}
                        {...product} PopUp={PopUp || (() => { })} />
                ))}
            </div>
        </div>

    );
}
