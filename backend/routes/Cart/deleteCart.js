import isAuth from "../../controller/Auth/Auth_controller.js";
import express from "express";
import { deleteCart } from "../../controller/Cart/deleteCartController.js";

const route = express.Router();

route.post("/delete_cart", isAuth, (deleteCart));


export default route;