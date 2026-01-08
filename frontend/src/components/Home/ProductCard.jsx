import React from "react";
function ProductCard({ key, id, title, description, rating, price, off, category, PopUp }) {
    let Img = `/img/${id}.png`
    function handleClick() {
        fetch("/add_cart", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        }).then(async res => {
            if (res.status === 401) {
                saveToLocalCart(id);
                PopUp();
                return;
            }

            if (!res.ok) {
                throw new Error("Server error");
            }

            const data = await res.json();
            console.log("DB Cart:", data);
            PopUp();
        })
            .catch(err => {
                console.error("Error:", err);
            });
    }
    function saveToLocalCart(id) {

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

    }

    return (
        <div key={key} id={id} category={category} className="Card">
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
                        ₹{
                            Math.round(Number(price) / (100 - Number(off)) * 100)
                        }
                    </p>
                    <p className="PriceOff">{off}% off</p>
                </div>

                <p className="Price">₹{price}</p>

            </div>
            <button onClick={handleClick} className="ProductCartBtn">Cart</button>
        </div>
    );
}

export default ProductCard;
