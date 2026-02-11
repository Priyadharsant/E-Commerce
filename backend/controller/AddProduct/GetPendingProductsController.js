import temp from "../../models/temp.js";

async function getPendingProducts(req, res, next) {
    try {
        // Check if user is authenticated (done by authMiddleware)
        if (!req.user) {
            return res.status(401).json({
                status: "Error",
                msg: "Unauthorized - Please login"
            });
        }

        // Fetch all products with "pending" status from the temp collection
        const products = await temp.find({ status: "pending" }).lean();

        if (!products || products.length === 0) {
            return res.status(200).json({
                status: "Success",
                products: [],
                msg: "No pending products"
            });
        }

        return res.status(200).json({
            status: "Success",
            products: products,
            count: products.length
        });
    } catch (error) {
        console.error("Error fetching pending products:", error);
        return res.status(500).json({
            status: "Error",
            msg: "Failed to fetch pending products",
            error: error.message
        });
    }
}

export default getPendingProducts;
