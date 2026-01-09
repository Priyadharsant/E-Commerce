import React, { useState, useEffect } from "react";
import Header from "../Header";
import CartCard from "./CartCard";
import Pop from "../Popup";

function Cart() {
    const [Carts, SetCarts] = useState([]);
    const [success, SetSuccess] = useState(false);
    const [Amount_detail, SetAmountDetails] = useState({
        Items: 0,
        Price: 0,
        TotalPrice: 0
    });


    function getLocalCart() {
        const cart = JSON.parse(localStorage.getItem("cart")) || {};
        return Object.values(cart); // convert object → array
    }

    function calculateAmounts(data) {
        const Price = data.reduce(
            (sum, product) => sum + Number(product.price) * product.quantity,
            0
        );

        SetAmountDetails({
            Items: data.length,
            Price,
            TotalPrice: Math.round(Price * 0.8 * 100) / 100
        });
    }


    function Update() {
        fetch("/get_cart", {
            credentials: "include"
        })
            .then(async res => {
                if (res.status === 401) {
                    const localCart = getLocalCart();
                    SetCarts(localCart);
                    calculateAmounts(localCart);
                    return;
                }

                if (!res.ok) throw new Error("Server error");

                const data = await res.json();

                if (!Array.isArray(data)) {
                    SetCarts([]);
                    calculateAmounts([]);
                    return;
                }

                SetCarts(data);
                calculateAmounts(data);
            })
            .catch(err => {
                console.error(err);
                const localCart = getLocalCart();
                SetCarts(localCart);
                calculateAmounts(localCart);
            });
    }
    useEffect(() => {
        Update();
    }, [Update]);
    ;


    function Popfunc() {
        SetSuccess(true);
        setTimeout(() => {
            SetSuccess(false);
        }, 3000);
    }
    return (
        <>
            <Header />

            <div className="CartsCon">
                {Carts.length > 0 ? (
                    <>
                        <div className="CartsDetailCon">
                            {Carts.map(cart => (
                                <CartCard
                                    key={cart.productId || cart.id}
                                    {...cart}
                                    UpdateQuantity={Update}
                                    PopUp={Popfunc}
                                />
                            ))}
                        </div>

                        <div className="CartsAmountCon">
                            <h2>Price Details</h2>

                            <div className="NItemsCon">
                                <p>No of Items</p>
                                <p>{Amount_detail.Items}</p>
                            </div>

                            <div className="TotalPriceCon">
                                <p>Price</p>
                                <p>₹{Amount_detail.Price}</p>
                            </div>

                            <div className="DiscountsCon">
                                <p>Discounts</p>
                                <p>20%</p>
                            </div>

                            <div className="FinalAmountCon">
                                <p>Total Amount</p>
                                <p>₹{Amount_detail.TotalPrice}</p>
                            </div>

                            <div className="BuyCon">
                                <div>
                                    <span className="material-symbols-outlined">
                                        shopping_bag
                                    </span>
                                    <button className="BuyBtn">Buy</button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (<p style={{ padding: "1rem", textAlign: "center" }}>
                    Your cart is empty
                </p>

                )}
            </div>

            <Pop success={success} />
        </>
    );
}

export default Cart;
