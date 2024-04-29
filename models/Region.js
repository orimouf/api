const mongoose = require("mongoose")

const RegionSchema = new mongoose.Schema(
    {
        appId: { type: String, required: true, unique: false },
        regionName: { type: String, required: true, unique: true },
        camion: { type: String, required: true }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Region", RegionSchema)