import Products from "../../models/Products.js";

async function AddProduct(req, res, next) {

    const result = await Products.create({
        category: req.body.category,
        Img: req.file?.path, 
        title: req.body.title,
        description: req.body.description,
        rating: Math.floor(Math.random() * 5),
        price: req.body.price,
        off: 25
    });
    console.log(result)
    res.status(200).json({
        status: "Success",
        msg: "Added Successfully"
    });
}


export default AddProduct;

// cat
// img
// tit
// des
// price