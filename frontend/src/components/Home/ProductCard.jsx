import React, { useEffect, useRef, useState } from "react";

function ProductCard({ id, title, description, rating, price, off, category, PopUp, index = 0 }) {

    const Img = `/img/${id}.png`;
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        if ('IntersectionObserver' in window) {
            const obs = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
            obs.observe(node);
            return () => obs.disconnect();
        } else {
            setVisible(true);
        }
    }, []);

    function handleClick() {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find(item => item.id === id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                id,
                title,
                description,   
                rating,
                price,
                off,
                category,
                Img,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        console.log("Updated Cart:", cart);

        PopUp();
    }

    return (
        <div ref={ref} id={id} category={category} className={`Card entry ${visible ? 'entry-visible' : 'entry-hidden'}`} >
            <div className="CardImg">
                <img src={Img} alt={title} />
            </div>

            <div className="ProductInfo">
                <h3>{title}</h3>

                <p className="Description">
                    {description}
                </p>

                <div className="Rating">{rating} ★</div>

                <div className="PriceOffCon">
                    <p className="OriginalPrice">
                        ₹{Math.round(Number(price) / (100 - Number(off)) * 100)}
                    </p>
                    <p className="PriceOff">{off}% off</p>
                </div>

                <p className="Price">₹{price}</p>
            </div>

            <button onClick={handleClick} className="ProductCartBtn">
                Cart
            </button>
        </div>
    );
}

export default ProductCard;
