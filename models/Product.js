const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        appId: { type: String, required: true, unique: false },
        name: { type: String, required: true, unique: true },
        price: { type: String, required: true },
        qty_par_one: { type: String, default: "" },
        image: { type: String, default: ""},
        status: { type: Boolean, default: false}
    },
    {timestamps: true}
)

module.exports = mongoose.model("Product", ProductSchema)