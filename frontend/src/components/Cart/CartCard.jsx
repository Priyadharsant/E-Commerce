import React from "react";

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

  function AddItems() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = cart.find(p => p.id === id);
    if (item) item.quantity += 1;

    localStorage.setItem("cart", JSON.stringify(cart));
    UpdateQuantity();
    PopUp();
  }

  function DeleteItems() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart
      .map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(cart));
    UpdateQuantity();
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
        <span onClick={DeleteItems} className="material-symbols-outlined">
          remove
        </span>

        <p>{quantity}</p>

        <span onClick={AddItems} className="material-symbols-outlined">
          add
        </span>
      </div>
    </div>
  );
}

export default CartCard;
