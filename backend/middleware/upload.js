import cloudinary from "../config/cloudinary.js";

export const approveImage = async (req, res) => {

    try {

        const tempPublicId = req.body.image;

        // Replace Temp → image
        const newPublicId = tempPublicId.replace(
            "E-Commerce/Temp/Img",
            "E-Commerce/Img"
        );

        const result = await cloudinary.uploader.rename(
            tempPublicId,
            newPublicId
        );

        res.json({
            msg: "Image approved and moved!",
            url: result.secure_url
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            msg: "Failed to move image"
        });
    }
};
