import React from "react";
import { ENDPOINTS } from "../../config/api";
import { fetchJson } from "../../utils/api";
import { logError, userMessageFromError } from "../../utils/errorHandler";
import useInView from "../../hooks/useInView";
function ProductCard({ slug, title, image, description, rating, price, off, category, PopUp }) {
    const [ref, inView] = useInView({ once: true });
    const [apiError, setApiError] = React.useState("");
    function handleClick() {
        (async function addToCart() {
            setApiError("");
            try {
                await fetchJson(ENDPOINTS.ADD_CART, { method: "POST", body: JSON.stringify({ slug }) });
                PopUp();
            } catch (err) {
                // 401 -> save to local cart
                if (err.status === 401) {
                    saveToLocalCart(slug);
                    PopUp();
                    return;
                }
                logError({ source: "Home:ProductCard:add_cart", slug });
                setApiError(userMessageFromError(err));
            }
        })();
    }
    function saveToLocalCart(slug) {

        let cart = JSON.parse(localStorage.getItem("Cart")) || [];

        const existingProduct = cart.find(item => item.slug === slug);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                slug,
                title,
                description,
                rating,
                price,
                off,
                category,
                image,
                quantity: 1
            });
        }


        localStorage.setItem("Cart", JSON.stringify(cart));


    }

    return (
        <div ref={ref} slug={slug} category={category} className={`Card scroll-animate ${inView ? "in-view" : ""}`}>
            <div className="CardImg">
                <img src={image} alt={title} />
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
