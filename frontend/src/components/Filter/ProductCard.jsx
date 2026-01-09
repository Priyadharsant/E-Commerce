import React from "react";
import { ENDPOINTS } from "../../config/api";
import { fetchJson } from "../../utils/api";
import { logError, userMessageFromError } from "../../utils/errorHandler";
import useInView from "../../hooks/useInView";
function ProductCard({ id, title, description, rating, price, off, category, PopUp }) {
    let Img = `/img/${id}.png`;
    const [ref, inView] = useInView({ once: true });
    const [apiError, setApiError] = React.useState("");
    function handleClick() {
        console.log(id);
        (async function add() {
            setApiError("");
            try {
                await fetchJson(ENDPOINTS.ADD_CART, { method: "POST", body: JSON.stringify({ id }) });
                PopUp();
            } catch (err) {
                if (err.status === 401) {
                    // fallback: save to local cart
                    saveToLocalCart(id);
                    PopUp();
                    return;
                }
                logError(err, { source: "Filter:ProductCard:add_cart", id });
                setApiError(userMessageFromError(err));
            }
        })();
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
        <div ref={ref} id={id} category={category} className={`Card scroll-animate ${inView ? "in-view" : ""}`}>
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
                {apiError && <p className="error small" style={{ marginTop: 8 }}>{apiError}</p>}

            </div>
            <button onClick={handleClick} className="ProductCartBtn">Cart</button>
        </div>
    );
}

export default ProductCard;
