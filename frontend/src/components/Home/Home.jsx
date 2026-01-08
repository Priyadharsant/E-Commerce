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
        fetch("/get")
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
                <div className="Container">
                    {products.map(product => (
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
