const mongoose = require("mongoose")

const FeesSchema = new mongoose.Schema(
    {
        appId: { type: String, required: true, unique: false },
        DieselFees: { type: String, required: true },
        MealFees: { type: String, required: true },
        OtherCostsSum: { type: String, default: "0" },
        DescriptionFees: { type: String, default: "" },
        date: { type: String, required: true, unique: false },
        camion: { type: String, required: true }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Fees", FeesSchema)