import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Cart from "./Cart/Cart";
import Filter from "./Filter/Filter";
import Login from "./Authorization/Login";
import Register from "./Authorization/Register";
import AddProduct from "./addProduct/AddProduct";
import ApprovalPanel from "./ApprovalPanel/ApprovalPanel";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/filter" element={<Filter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/approval-panel" element={<ApprovalPanel />} />
        </Routes>
    );
}

export default App;
