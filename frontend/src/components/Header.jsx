import React from "react";
import { createRoot } from "react-dom/client";
import { Link } from "react-router-dom"

function Header() {
    return <header>
        <div className="header-logo">
            <span className="material-symbols-outlined">
                shopping_cart
            </span>
            <h1>Fakekart</h1>
        </div>
        <nav>
            <Link to="/">
                <div>
                    <span className="material-symbols-outlined">
                        home
                    </span>
                    <p>Home</p>
                </div>
            </Link>
            <Link to="/cart" ><div>
                <span className="material-symbols-outlined">
                    shopping_cart
                </span>
                <p>Cart</p>
            </div></Link>
        </nav>

    </header>
}

export default Header;