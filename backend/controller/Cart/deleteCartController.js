import Cart from "../../models/Cart.js";

export const deleteCart = async (req, res, next) => {
    try {
        const { slug } = req.body;
        const userId = req.user._id;

        const item = await Cart.findOne({ userId, productId: slug });
        if (!item) return res.json({ msg: "Item not found" });

        if (item.quantity <= 1) {
            await Cart.deleteOne({ userId, productId: slug });
        } else {
            await Cart.updateOne(
                { userId, productId: slug },
                { $inc: { quantity: -1 } }
            );
        }

        res.json({ msg: "Item deleted from cart" });
    } catch (err) {
        next(err);
    }
};