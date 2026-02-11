import temp from "../../models/temp.js";
import { mailer } from "../../config/mail.js";
import { approvalEmailTemplate } from "../../config/approvalMailTemplate.js";

async function AddProduct(req, res, next) {
    try {
        // Parse data from request body
        const parsedData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;

        const result = await temp.create({
            data: {
                category: parsedData.category,
                image: req.file?.path,
                title: parsedData.title,
                description: parsedData.description,
                rating: Math.floor(Math.random() * 5),
                price: parsedData.price,
                off: Math.floor(Math.random() * 50),

            }, status: "pending"
        });

        const adminEmail = process.env.ADMIN_EMAIL;
        const emailContent = approvalEmailTemplate(result.data, result._id);

        await mailer.sendMail({
            from: process.env.GMAIL,
            to: adminEmail,
            subject: `New Product Approval Required: ${result.data.title}`,
            html: emailContent
        });

        res.status(200).json({
            status: "Success",
            msg: "Added Successfully",
            productId: result._id
        });
    } catch (err) {
        next(err);
    }
}


export default AddProduct;

// cat
// img
// tit
// des
// price