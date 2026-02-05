import isAuth from "../../controller/Auth/Auth_controller.js";
import AddProduct from "../../controller/AddProduct/AddProductController.js";
import upload from "./../../middleware/upload.js";
import express from "express";

const route = express.Router();

route.post("/addProduct", isAuth, upload.single("image"), (AddProduct));


export default route;