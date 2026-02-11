import Products from "../../models/Products.js";
import history from "../../models/history.js";

async function deleteProduct(req, res, next) {
    try {

        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                status: "Error",
                msg: "Slug is required"
            });
        }

        const product = await Products.findOneAndDelete({ slug });
        if (!product) {
            return res.status(404).json({
                status: "Error",
                msg: "Product not found"
            });
        }
        else {
            await history.create({ data: product });
            return res.status(200).json({
                status: "success",
                msg: "Product deleted!"
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ msg: err.msg });

    }
}
export default deleteProduct;