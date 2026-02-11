import temp from "../../models/temp.js";
import { mailer } from "../../config/mail.js";

async function RejectProduct(req, res, next) {
    try {
        const { productId } = req.params;
        const { reason } = req.body;

        // Validate productId is a valid MongoDB ObjectId
        if (!productId || productId.length !== 24) {
            return res.status(400).json({
                status: "Error",
                msg: "Invalid product ID format"
            });
        }

        // Validate rejection reason
        if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
            return res.status(400).json({
                status: "Error",
                msg: "Rejection reason must be at least 5 characters long"
            });
        }

        const product = await temp.findById(productId);

        if (!product) {
            return res.status(404).json({
                status: "Error",
                msg: "Product not found"
            });
        }

        if (product.status === "rejected") {
            return res.status(400).json({
                status: "Error",
                msg: "Product already rejected"
            });
        }

        product.status = "rejected";
        product.rejectionReason = reason.trim();
        await product.save();

        const emailContent = `
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; background-color: white; padding: 30px; border-radius: 8px; margin: 0 auto;">
                    <div style="background-color: #e74c3c; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                        <h1>✗ Product Rejected</h1>
                    </div>
                    <p>The product <strong>${product.data.title}</strong> has been rejected.</p>
                    <div style="border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
                        <p><strong>Product Details:</strong></p>
                        <p>Title: ${product.data.title}</p>
                        <p>Category: ${product.data.category}</p>
                        <p>Price: $${product.data.price}</p>
                        <p style="color: #e74c3c;"><strong>Rejection Reason:</strong></p>
                        <p>${product.rejectionReason}</p>
                    </div>
                </div>
            </body>
        </html>
        `;

        return res.status(200).json({
            status: "Success",
            msg: "Product rejected successfully"
        });
    } catch (err) {
        next(err);
    }
}

export default RejectProduct;
