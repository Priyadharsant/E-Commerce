import React from "react";


function getLocalCart() {
  return JSON.parse(localStorage.getItem("cart")) || {};
}

function setLocalCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function CartCard({
  id,
  title,
  description,
  rating,
  price,
  off,
  quantity,
  UpdateQuantity,
  PopUp
}) {

  /* ---------- LOCAL CART LOGIC ---------- */
  function addToLocalCart() {

    let cart = getLocalCart() || [];

    const item = cart.find(p => p.id === id);
    if (item) item.quantity += 1;

    setLocalCart(cart)
  }

  function deleteFromLocalCart(productId) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart
      .map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);
    setLocalCart(cart)
    UpdateQuantity();
  }

  function AddItems() {

    fetch("/add_cart", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
      .then(res => {
        if (res.status === 401) {
          addToLocalCart();
          UpdateQuantity();
          PopUp();
          return;
        }

        if (!res.ok) throw new Error("Server error");

        UpdateQuantity();
        PopUp();
      })
      .catch(err => console.error(err));
  }

  /* ---------- DELETE ITEM ---------- */
  function DeleteItems() {
    fetch("/delete_cart", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
      .then(res => {
        if (res.status === 401) {
          deleteFromLocalCart(id);
          UpdateQuantity();
          return;
        }

        if (!res.ok) throw new Error("Server error");

        UpdateQuantity();
      })
      .catch(err => console.error(err));
  }

  return (
    <div id={id} className="Card Cart">
      <div className="CardImg">
        <img src={`/img/${id}.png`} alt={title} />
      </div>

      <div className="ProductInfo">
        <h3>{title}</h3>
        <p className="Description">{description}</p>
        <div className="Rating">{rating} ★</div>

        <div className="PriceOffCon">
          <p className="OriginalPrice">
            ₹{Math.round(Number(price) / (100 - Number(off)) * 100)}
          </p>
          <p className="PriceOff">{off}% off</p>
        </div>

        <p className="Price">₹ {price}</p>
      </div>

      <div className="CartQuantity">
        <span
          onClick={() => DeleteItems()}
          className="material-symbols-outlined"
        >
          remove
        </span>

        <p>{quantity}</p>

        <span
          onClick={() => AddItems()}
          className="material-symbols-outlined"
        >
          add
        </span>
      </div>
    </div>
  );
}

export default CartCard;
