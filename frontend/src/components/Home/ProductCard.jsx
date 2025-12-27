import React from "react";

function ProductCard({ id, title, description, rating, price, off, category, PopUp }) {

    const Img = `/img/${id}.png`;

    function handleClick() {

        // 1️⃣ Get cart from localStorage
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // 2️⃣ Check if product already exists
        const existingProduct = cart.find(item => item.id === id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                id,
                title,
                description,   // ✅ INCLUDED
                rating,
                price,
                off,
                category,
                Img,
                quantity: 1
            });
        }

        // 3️⃣ Save cart back
        localStorage.setItem("cart", JSON.stringify(cart));

        console.log("Updated Cart:", cart);

        // 4️⃣ Popup
        PopUp();
    }

    return (
        <div id={id} category={category} className="Card">
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
