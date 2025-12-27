import React from "react";
import reactDom from "react-dom";
import Header from "./Header";
import Home from "./Home/Home";
import Cart from "./Cart/Cart";
import Pop from "./Popup";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
        </Routes>
    </BrowserRouter>
}
export default App;