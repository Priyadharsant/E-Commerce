export const approvalEmailTemplate = (product, productId) => {
    const VeiwLink = `${process.env.FRONTEND_URL}/approval-panel`;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                margin: 0 auto;
            }
            .header {
                background-color: #2c3e50;
                color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin-bottom: 30px;
            }
            .product-details {
                border: 1px solid #e0e0e0;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                background-color: #f9f9f9;
            }
            .detail-row {
                display: flex;
                margin-bottom: 12px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            .detail-label {
                font-weight: bold;
                color: #2c3e50;
                width: 120px;
            }
            .detail-value {
                color: #555;
                flex: 1;
            }
            .product-image {
                max-width: 200px;
                height: auto;
                border-radius: 5px;
                margin-bottom: 15px;
            }
            .action-buttons {
                display: flex;
                gap: 15px;
                margin-top: 30px;
                justify-content: center;
            }
            .btn {
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                font-size: 16px;
                cursor: pointer;
                border: none;
                display: inline-block;
                color:white;
                background: #1b5fd1;
                transition:all 0.3s ease;
            }
            
            .btn:hover {
                background-color: hsl(218, 77%, 36%);
                transform:scale(1.1);
            }
            
            .footer {
                text-align: center;
                color: #999;
                font-size: 12px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📦 New Product Approval Request</h1>
            </div>

            <h2 style="color: #2c3e50;">Product Details</h2>
            
            <div class="product-details">
                ${product.image ? `<img src="${product.image}" alt="Product Image" class="product-image">` : ''}
                
                <div class="detail-row">
                    <span class="detail-label">Product ID:</span>
                    <span class="detail-value">${productId}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Title:</span>
                    <span class="detail-value"><strong>${product.title}</strong></span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Category:</span>
                    <span class="detail-value">${product.category}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${product.description}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Price:</span>
                    <span class="detail-value"><strong>₹${product.price}</strong></span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Discount:</span>
                    <span class="detail-value">${product.off}%</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Rating:</span>
                    <span class="detail-value">⭐ ${product.rating}/5</span>
                </div>
            </div>

            <p style="color: #555; line-height: 1.6;">
                A new product has been submitted for approval. Please review the details above and take action by clicking one of the buttons below.
            </p>

            <div class="action-buttons">
                <a href="${VeiwLink}" class="btn ">View Products</a>
            </div>

            <div class="footer">
                <p>This is an automated email. Please do not reply directly to this message.</p>
                <p>&copy; 2026 E-Commerce Platform. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
