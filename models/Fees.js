const mongoose = require("mongoose")

const FeesSchema = new mongoose.Schema(
    {
        appId: { type: String, required: true, unique: false },
        DieselFees: { type: String, required: true },
        MealFees: { type: String, required: true },
        OtherCostsSum: { type: String, required: true },
        DescriptionFees: { type: String, required: true },
        date: { type: String, required: true, unique: true },
        camion: { type: String, required: true }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Fees", FeesSchema)