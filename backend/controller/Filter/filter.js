import Products from "./../../models/Products.js"

export const filter = async (req, res) => {
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
}

export const category = async (req, res) => {
    const categories = await Products.distinct("category");
    res.json(categories);
}