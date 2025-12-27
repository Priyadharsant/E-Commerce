import React from 'react';
import Home from "./Home/Home";
import Cart from "./Cart/Cart";
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