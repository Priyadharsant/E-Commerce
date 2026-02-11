import React from "react";
import { logError, userMessageFromError } from "../../utils/errorHandler";
import useInView from "../../hooks/useInView";
import ConfirmModal from "../ConfirmModal";
import { apiUrl } from "../../config/api";
import { useNavigate } from "react-router-dom";

/* ---------- LOCAL CART ---------- */

function getLocalCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function setLocalCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
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

    setLocalCart(cart);
}

function ProductCard({
    slug,
    title,
    image,
    description,
    rating,
    price,
    off,
    category,
    PopUp
}) {

    const [showConfirm, setShowConfirm] = React.useState(false);
    const [apiError, setApiError] = React.useState("");

    const [ref, inView] = useInView({ once: true });
    const navigate = useNavigate();

    /* ---------- DELETE PRODUCT ---------- */

    async function handleDeleteConfirm() {

        try {

            const response = await fetch(
                apiUrl(`/addProduct/delete/${slug}`),
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 401) {
                navigate("/login");
                return;
            }

            if (response.status === 403) {
                setApiError("You don't have permission.");
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.msg || "Failed to approve product");
            }

            // ✅ AFTER SUCCESS → update local cart
            let cart = getLocalCart();
            cart = cart.filter(item => item.slug !== slug);
            setLocalCart(cart);

            setShowConfirm(false);
            PopUp?.({ msg: "Product deleted successfully", status: true });
            setTimeout(() => { window.location.reload() }, 5000)

        } catch (err) {

            logError(err, { source: "ProductCard:delete", slug });
            setApiError(userMessageFromError(err));
        }
    }

    /* ---------- ADD TO CART ---------- */

    function handleClick() {

        try {

            saveToLocalCart({
                slug,
                title,
                image,
                description,
                rating,
                price,
                off,
                category
            });

            PopUp?.({ msg: "Add to Cart Successfully", status: true });

        } catch (err) {

            logError(err, { source: "ProductCard:add_cart", slug });
            setApiError(userMessageFromError(err));
        }
    }

    return (
        <div
            ref={ref}
            className={`Card scroll-animate ${inView ? "in-view" : ""}`}
        >
            <div
                className="deleteBtn"
                onClick={() => setShowConfirm(true)}
            >
                <span className="material-symbols-outlined">
                    delete
                </span>
            </div>

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

            <ConfirmModal
                open={showConfirm}
                message="Remove this item?"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}

export default ProductCard;
