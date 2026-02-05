import Cart from "../../models/Cart.js";
import Products from "../../models/Products.js";

export const getCart = async (req, res) => {
    const cartItems = await Cart.find({ userId: req.user._id });

    const ids = cartItems.map(i => i.productId);
    const products = await Products.find({ slug: { $in: ids } });

    const result = products.map(p => {
        const cart = cartItems.find(c => c.productId === p.slug);
        return { ...p._doc, quantity: cart.quantity };
    });

    res.json(result);
}