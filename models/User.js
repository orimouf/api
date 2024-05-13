const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        appId: { type: String, required: true, unique: false },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profilePic: { type: String, default: "" },
        camion: { type: String, default: "CAMION 1"},
        isAdmin: { type: Boolean, default: false}
    },
    {timestamps: true}
)

module.exports = mongoose.model("User", UserSchema)