const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        price: { type: String, required: true },
        promoPrice: { type: String, default: ""},
        productPic: { type: String, default: "" },
        prdPic1: { type: String, default: ""},
        prdPic2: { type: String, default: ""},
        prdPic3: { type: String, default: ""},
        prdPic4: { type: String, default: ""},
        isValable: { type: Boolean, default: false},
        isPromo: { type: Boolean, default: false}
    },
    {timestamps: true}
)

module.exports = mongoose.model("Product", ProductSchema)