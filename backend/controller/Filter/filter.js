import Products from "./../../models/Products.js"

export const filter = async (req, res, next) => {
    try {
        const { category } = req.query;

        if (!category || category === "all") {
            const products = await Products.find();
            const grouped = {};

            products.forEach(p => {
                if (!grouped[p.category]) grouped[p.category] = [];
                grouped[p.category].push(p);
            });

            return res.json({ type: "all", data: grouped });
        }

        const products = await Products.find({ category });
        res.json({ type: "single", data: { [category]: products } });
    } catch (err) {
        next(err);
    }
}

export const category = async (req, res, next) => {
    try {
        const categories = await Products.distinct("category");

        res.json(categories);
    } catch (err) {
        next(err);
    }
}