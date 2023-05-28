const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
        appId: { type: String, required: true, unique: true },
        clientName: { type: String, required: true },
        clientId: { type: String, required: true },
        productListId: { type: String, required: true },
        totalToPay: { type: String, required: true },
        isCredit: { type: Boolean, default: false }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Order", OrderSchema)