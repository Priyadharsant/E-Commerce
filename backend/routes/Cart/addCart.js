import isAuth from "../../controller/Auth/Auth_controller.js";
import { addCart } from "../../controller/Cart/addCartController.js";
import express from "express";

const route = express.Router();

route.post("/add_cart", isAuth, (addCart));


export default route;