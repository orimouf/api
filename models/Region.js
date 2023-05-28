const mongoose = require("mongoose")

const RegionSchema = new mongoose.Schema(
    {
        appId: { type: String, required: true, unique: true },
        regionName: { type: String, required: true, unique: true }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Region", RegionSchema)