import React, { useEffect, useState } from "react";
import { ENDPOINTS } from "../../config/api";
import { fetchJson } from "../../utils/api";
import { userMessageFromError, logError } from "../../utils/errorHandler";
import LoadingSpinner from "../LoadingSpinner";
import Header from "../Header.jsx";
import Pop from "../Popup";
import ProductCard from "./ProductCard";

function shuf(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}



function Home() {
    const [products, setProducts] = useState([]);
    const [success, SetSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;
        (async function load() {
            setLoading(true);
            setError("");
            try {
                const data = await fetchJson(ENDPOINTS.GET_PRODUCTS);
                console.log(data)
                
                // if (!Array.isArray(data)) throw new Error("Invalid products data");
                if (mounted) setProducts(shuf(data));
            } catch (err) {
                logError(err, { source: "Home:get_products" });
                if (mounted) setError(userMessageFromError(err));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);
    function Popfunc() {
        SetSuccess(true)
        setTimeout(() => {
            SetSuccess(false)
        }, 5000)
    }



    return (
        <>
            <Header />
            <main>
                <div className="Container">
                    {loading && (
                        <div style={{ width: "100%", textAlign: "center", padding: "1rem" }}>
                            <LoadingSpinner />
                        </div>
                    )}
                    {error && <p className="error">{error}</p>}
                    {!loading && !error && products.map(product => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            description={product.description}
                            rating={product.rating}
                            price={product.price}
                            off={product.off}
                            category={product.category}
                            PopUp={Popfunc}
                        />
                    ))}
                </div>
            </main>
            <Pop success={success} />
        </>
    );
}

export default Home;
