import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Cart from "./Cart/Cart";
import Filter from "./Filter/Filter";
import Login from "./Authorization/Login";
import Register from "./Authorization/Register";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/filter" element={<Filter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

export default App;
