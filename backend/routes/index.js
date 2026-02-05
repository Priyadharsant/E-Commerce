import express from "express";
import Auth from "./Auth/Auth.js";
import getProduct from "./Home/getProduct.js";
import filter from "./Filter/filter.js"
import addCart from "./Cart/addCart.js"
import deleteCart from "./Cart/deleteCart.js"
import getCart from "./Cart/getCart.js"
import AddProduct from "./AddProduct/AddProduct.js";

const routes = express.Router();

routes.use("", Auth);
routes.use("", getProduct);
routes.use("", filter);
routes.use("", addCart);
routes.use("", getCart)
routes.use("", deleteCart)
routes.use("", AddProduct);


export default routes;