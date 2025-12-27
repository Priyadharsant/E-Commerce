import React from "react";

function Pop({ success }) {
    if (!success) return
    return (<div className="Pop">
        <div><p>Product Add to Cart Successfully</p></div>
        <span className="material-symbols-outlined">
            shopping_cart
        </span>
    </div>)
}

export default Pop;