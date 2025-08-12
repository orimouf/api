const mongoose = require("mongoose")

const FridgeSchema = new mongoose.Schema(
    {
        appId: { type: String, required: false },
        clientName: { type: String, required: true },
        clientId: { type: Object, required: true },
        region: { type: String, required: true },
        totalFridgePrice: { type: String, required: true },
        paymentFridgePrice: { type: String, required: true },
        restFridgePrice: { type: String, required: true },
        date: { type: String, required: true },
        camion: { type: String, required: true },
        isCheck: { type: Boolean, default: false }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Fridge", FridgeSchema)    