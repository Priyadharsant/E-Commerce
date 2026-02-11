import Products from "../../models/Products.js";

async function getProducts(req, res, next) {
    try {
        const products = await Products.find();
        res.json(products);
    } catch (err) {
        next(err);
    }
}

export default getProducts;