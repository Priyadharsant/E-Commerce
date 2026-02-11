import React from "react";
import { logError, userMessageFromError } from "../../utils/errorHandler";
import useInView from "../../hooks/useInView";

/* ✅ STORAGE KEY */
const CART_KEY = "cart";

/* ---------- LOCAL CART ---------- */

function getLocalCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveToLocalCart(product) {

    let cart = getLocalCart();

    const existing = cart.find(item => item.slug === product.slug);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function ProductCard({
    slug,
    title,
    description,
    rating,
    price,
    image,
    off,
    category,
    PopUp
}) {

    const [ref, inView] = useInView({ once: true });
    const [apiError, setApiError] = React.useState("");

    /* ---------- ADD TO CART ---------- */

    async function handleClick() {

        setApiError("");

        try {

            saveToLocalCart({
                slug,
                title,
                description,
                rating,
                price,
                image,
                off,
                category
            });

            PopUp?.({ msg: "Add to Cart Successfully", status: true });

        } catch (err) {

            // Guest user fallback
            if (err?.status === 401) {

                saveToLocalCart({
                    slug,
                    title,
                    description,
                    rating,
                    price,
                    image,
                    off,
                    category
                });

                PopUp?.({ msg: "Add to cart successfully", status: true });
                return;
            }

            logError(err, { source: "ProductCard:add_cart", slug });

            setApiError(userMessageFromError(err));
        }
    }

    return (
        <div
            ref={ref}
            className={`Card scroll-animate ${inView ? "in-view" : ""}`}
        >
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
                        ₹{Math.round(Number(price) / (100 - Number(off)) * 100)}
                    </p>
                    <p className="PriceOff">{off}% off</p>
                </div>

                <p className="Price">₹{price}</p>

                {apiError && (
                    <p className="error small" style={{ marginTop: 8 }}>
                        {apiError}
                    </p>
                )}
            </div>

            <button
                onClick={handleClick}
                className="ProductCartBtn"
            >
                Add to Cart
            </button>
        </div>
    );
}

export default ProductCard;
