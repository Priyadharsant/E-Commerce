import React, { useState, useEffect, useCallback } from "react";
import { ENDPOINTS } from "../../config/api";
import { fetchJson } from "../../utils/api";
import { logError } from "../../utils/errorHandler";
import Header from "../Header";
import CartCard from "./CartCard";
import Pop from "../Popup";
import { useAuth } from "../Authorization/auth.js";

function Cart() {

    const { user, loading } = useAuth();

    const [carts, setCarts] = useState([]);
    const [success, setSuccess] = useState(false);
    const [Popdata, setPopdata] = useState({})

    const [amountDetail, setAmountDetail] = useState({
        items: 0,
        price: 0,
        totalPrice: 0
    });

    // ✅ Local cart
    const getLocalCart = useCallback(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || {};
        return Object.values(cart);
    }, []);

    // ✅ Calculate price
    const calculateAmounts = useCallback((data) => {

        const price = data.reduce(
            (sum, product) => sum + Number(product.price) * product.quantity,
            0
        );

        const totalItems = data.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        setAmountDetail({
            items: totalItems,
            price,
            totalPrice: Math.round(price * 0.8 * 100) / 100
        });

    }, []);

    // ✅ Load cart
    const updateCart = useCallback(() => {

        (async function loadCart() {

            try {

                // 🔥 Wait until auth finishes
                if (loading) return;

                let data;

                if (user) {

                    data = await fetchJson(ENDPOINTS.GET_CART);

                } else {

                    data = getLocalCart();
                }

                if (!Array.isArray(data)) data = [];

                setCarts(data);
                calculateAmounts(data);

            } catch (err) {

                logError(err, { source: "Cart:updateCart" });

                const localCart = getLocalCart();
                setCarts(localCart);
                calculateAmounts(localCart);
            }

        })();

    }, [user, loading, getLocalCart, calculateAmounts]);

    useEffect(() => {
        updateCart();
    }, [updateCart]);

    function popFunc(data) {
        setSuccess(true)
        setPopdata(data)
        setTimeout(() => {
            setSuccess(false)
        }, 5000)
    }

    // ✅ Prevent flicker
    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading cart...</p>;
    }

    return (
        <>
            <Header />

            <div className="CartsCon">

                {carts.length > 0 ? (

                    <>
                        <div className="CartsDetailCon">
                            {carts.map(cart => (
                                <CartCard
                                    key={cart.slug}
                                    {...cart}
                                    UpdateQuantity={updateCart}
                                    PopUp={popFunc}
                                />
                            ))}
                        </div>

                        <div className="CartsAmountCon">

                            <h2>Price Details</h2>

                            <div>
                                <p>No of Items</p>
                                <p>{amountDetail.items}</p>
                            </div>

                            <div>
                                <p>Price</p>
                                <p>₹{amountDetail.price}</p>
                            </div>

                            <div>
                                <p>Discount</p>
                                <p>20%</p>
                            </div>

                            <div>
                                <p>Total Amount</p>
                                <p>₹{amountDetail.totalPrice}</p>
                            </div>

                            <button className="BuyBtn">
                                Buy
                            </button>

                        </div>
                    </>

                ) : (

                    <p style={{ padding: "1rem", textAlign: "center" }}>
                        Your cart is empty
                    </p>
                )}
            </div>

            <button
                className="BuyBtn"
                onClick={() => window.print()}
            >
                Print
            </button>

            <Pop success={success} Popdata={Popdata} />
        </>
    );
}

export default Cart;
