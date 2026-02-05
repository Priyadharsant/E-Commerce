import Products from "../../models/Products.js";

async function getProducts(req, res, next) {
    const products = await Products.find();
    res.json(products);
}

export default getProducts;