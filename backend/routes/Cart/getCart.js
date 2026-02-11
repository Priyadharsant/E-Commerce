
import { isAuth } from "../../controller/Auth/Auth_controller.js";
import { getCart } from "../../controller/Cart/getCartController.js";
import express from "express";

const route = express.Router();

route.get("/get_cart", isAuth, getCart);


export default route;