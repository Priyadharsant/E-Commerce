import express from "express";
import getProduct from "../../controller/Home/getProduct_controller.js";

const route = express.Router();

route.get("/get", (getProduct));

export default route;