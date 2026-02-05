import Products from "../../models/Products.js";
import express from "express";
import { filter, category } from "../../controller/Filter/filter.js";

const route = express.Router();

route.get("/filter", filter);
route.get("/categories", category);

export default route;