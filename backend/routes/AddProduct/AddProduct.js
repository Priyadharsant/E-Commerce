import { isAuth } from "../../controller/Auth/Auth_controller.js";
import AddProduct from "../../controller/AddProduct/AddProductController.js";
import ApproveProduct from "../../controller/AddProduct/ApproveProductController.js";
import RejectProduct from "../../controller/AddProduct/RejectProductController.js";
import GetPendingProducts from "../../controller/AddProduct/GetPendingProductsController.js";
import upload from "../../middleware/uploadToTem.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import deleteProduct from "../../controller/AddProduct/DeleteProduct.js";
import express from "express";

const route = express.Router();

route.post("/addProduct", upload.single("image"), AddProduct);
route.get("/addProduct/pending", authMiddleware, adminMiddleware, GetPendingProducts);
route.get("/addProduct/approve/:productId", authMiddleware, adminMiddleware, ApproveProduct);
route.post("/addProduct/reject/:productId", authMiddleware, adminMiddleware, RejectProduct);
route.get("/addProduct/delete/:slug", authMiddleware, adminMiddleware, deleteProduct);


export default route;