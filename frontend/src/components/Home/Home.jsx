import React, { useEffect, useState } from "react";
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
    useEffect(() => {
        fetch("https://e-commerce-voig.onrender.com/get")
            .then(res => res.json())
            .then(data => {
                data = shuf(data)
                setProducts(data);
            })
            .catch(err => console.error(err));
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
                {products.map(product => (
                    <ProductCard
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
            </main>
            <Pop success={success} />
        </>
    );
}

export default Home;
