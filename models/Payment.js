const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema(
    {
        appId: { type: String, required: false },
        clientName: { type: String, required: true },
        clientId: { type: Object, required: true },
        region: { type: String, required: true },
        oldSomme: { type: String, required: true },
        verssi: { type: String, required: true },
        rest: { type: String, required: true },
        date: { type: String, required: true },
        camion: { type: String, required: true },
        isCheck: { type: Boolean, default: false }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Payment", PaymentSchema)