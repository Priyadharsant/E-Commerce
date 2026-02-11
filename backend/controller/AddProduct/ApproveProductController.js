import temp from "../../models/temp.js";
import { mailer } from "../../config/mail.js";
import Products from "../../models/Products.js";
import slugify from "slugify";
// Generate slug from title
function generateSlug(productData, productId) {
    // Validate title is a string
    if (!productData.title || typeof productData.title !== 'string') {
        throw new Error('Product title is required and must be a string');
    }

    const baseSlug = slugify(productData.title, {
        lower: true,
        strict: true
    });

    // take last 4 characters from Mongo _id
    const uniquePart = productId.toString().slice(-4);

    return `${baseSlug}-${uniquePart}`;
}

async function ApproveProduct(req, res, next) {
    try {
        const { productId } = req.params;

        // Validate productId is a valid MongoDB ObjectId
        if (!productId || productId.length !== 24) {
            return res.status(400).json({
                status: "Error",
                msg: "Invalid product ID format"
            });
        }

        const product = await temp.findById(productId);

        if (!product) {
            return res.status(404).json({
                status: "Error",
                msg: "Product not found"
            });
        }

        if (product.status === "approved") {
            return res.status(400).json({
                status: "Error",
                msg: "Product already approved"
            });
        }

        // Validate product data before processing
        if (!product.data || !product.data.title) {
            return res.status(400).json({
                status: "Error",
                msg: "Invalid product data"
            });
        }

        product.status = "approved";
        const productData = {
            ...product.data,
            slug: generateSlug(product.data, product._id)
        };
        await Products.insertMany(productData);
        await product.save();

        const emailContent = `
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; background-color: white; padding: 30px; border-radius: 8px; margin: 0 auto;">
                    <div style="background-color: #27ae60; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                        <h1>✓ Product Approved</h1>
                    </div>
                    <p>The product <strong>${product.data.title}</strong> has been successfully approved and is now live on the store.</p>
                    <div style="border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
                        <p><strong>Product Details:</strong></p>
                        <p>Title: ${product.data.title}</p>
                        <p>Category: ${product.data.category}</p>
                        <p>Price: $${product.data.price}</p>
                    </div>
                </div>
            </body>
        </html>
        `;

        return res.status(200).json({
            status: "Success",
            msg: "Product approved successfully"
        });
    } catch (err) {
        next(err);
    }
}

export default ApproveProduct;
