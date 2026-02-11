import Cart from "../../models/Cart.js";

export const addCart = async (req, res, next) => {
    try {
        const { slug } = req.body;
        const userId = req.user._id;

        const item = await Cart.findOne({ userId, productId: slug });

        if (!item) {
            await Cart.create({ userId, productId: slug, quantity: 1 });
        } else {
            await Cart.updateOne(
                { userId, productId: slug },
                { $inc: { quantity: 1 } }
            );
        }

        res.json({ msg: "Added to cart" });
    } catch (err) {
        next(err);
    }
}