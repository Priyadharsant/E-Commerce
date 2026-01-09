import React from "react";
import { apiUrl, ENDPOINTS } from "../../config/api";
function ProductCard({ id, title, description, rating, price, off, category, PopUp }) {
    let Img = `/img/${id}.png`
    function handleClick() {
        console.log(id);

        fetch(apiUrl(ENDPOINTS.ADD_CART), {
            method: "POST",
            credentials: "include", // ⭐ MUST
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        }).then(res => res.json())
            .then(data => {
                console.log("Success:", data);
                PopUp();
            })
            .catch(err => {
                console.error("Error:", err);
            });
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
