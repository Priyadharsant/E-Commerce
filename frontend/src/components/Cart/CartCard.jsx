import React from "react";
import { ENDPOINTS } from "../../config/api";
import { fetchJson } from "../../utils/api";
import { logError, userMessageFromError } from "../../utils/errorHandler";


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
  const [apiError, setApiError] = React.useState("");

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

  async function AddItems() {
    setApiError("");
    try {
      await fetchJson(ENDPOINTS.ADD_CART, { method: "POST", body: JSON.stringify({ id }) });
      UpdateQuantity();
      PopUp();
    } catch (err) {
      if (err.status === 401) {
        addToLocalCart();
        UpdateQuantity();
        PopUp();
        return;
      }
      logError(err, { source: "CartCard:AddItems", id });
      setApiError(userMessageFromError(err));
    }
  }

  /* ---------- DELETE ITEM ---------- */
  async function DeleteItems() {
    setApiError("");
    try {
      await fetchJson(ENDPOINTS.DELETE_CART, { method: "POST", body: JSON.stringify({ id }) });
      UpdateQuantity();
    } catch (err) {
      if (err.status === 401) {
        deleteFromLocalCart(id);
        UpdateQuantity();
        return;
      }
      logError(err, { source: "CartCard:DeleteItems", id });
      setApiError(userMessageFromError(err));
    }
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
        {apiError && <p className="error small" style={{ marginTop: 8 }}>{apiError}</p>}
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
