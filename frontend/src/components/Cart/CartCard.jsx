import React from "react";
import { ENDPOINTS } from "../../config/api";
import { fetchJson } from "../../utils/api";
import { logError, userMessageFromError } from "../../utils/errorHandler";

/* ---------- LOCAL STORAGE HELPERS ---------- */

function getLocalCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function setLocalCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function CartCard({
  slug,
  title,
  description,
  rating,
  image,
  price,
  off,
  quantity,
  UpdateQuantity,
  PopUp
}) {
  const [apiError, setApiError] = React.useState("");

  /* ---------- ADD LOCAL ---------- */

  function addToLocalCart() {

    let cart = getLocalCart();

    const index = cart.findIndex(p => p.slug === slug);

    if (index !== -1) {

      cart[index].quantity += 1;

    } else {

      cart.push({
        slug,
        title,
        price,
        image,
        quantity: 1
      });
    }

    setLocalCart(cart);
    UpdateQuantity();
    PopUp?.({ msg: "Add to Cart Successfully", status: true });
  }

  /* ---------- DELETE LOCAL ---------- */

  function deleteFromLocalCart() {

    let cart = getLocalCart();

    cart = cart
      .map(item =>
        item.slug === slug
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);

    setLocalCart(cart);
    UpdateQuantity();
  }

  /* ---------- ADD ITEM ---------- */

  async function AddItems() {

    setApiError("");

    try {

      addToLocalCart()
      UpdateQuantity();
      PopUp?.({ msg: "Add to Cart Successfully", status: true });

    } catch (err) {

      // 🔥 If not logged in → fallback local cart
      if (err?.status === 401) {
        addToLocalCart();
        return;
      }

      logError(err, { source: "CartCard:AddItems", slug });
      setApiError(userMessageFromError(err));
    }
  }

  /* ---------- DELETE ITEM ---------- */

  async function DeleteItems() {

    setApiError("");

    try {

      await fetchJson(ENDPOINTS.DELETE_CART, {
        method: "POST",
        body: JSON.stringify({ slug })
      });

      UpdateQuantity();

    } catch (err) {

      if (err?.status === 401) {
        deleteFromLocalCart();
        return;
      }

      logError(err, { source: "CartCard:DeleteItems", slug });
      setApiError(userMessageFromError(err));
    }
  }

  return (
    <div className="Card Cart">
      <div className="CardImg">
        <img src={image} alt={title} />
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

        {apiError && (
          <p className="error small" style={{ marginTop: 8 }}>
            {apiError}
          </p>
        )}
      </div>

      <div className="CartQuantity">
        <span
          onClick={DeleteItems}
          className="material-symbols-outlined"
        >
          remove
        </span>

        <p>{quantity}</p>

        <span
          onClick={AddItems}
          className="material-symbols-outlined"
        >
          add
        </span>
      </div>
    </div>
  );
}

export default CartCard;
