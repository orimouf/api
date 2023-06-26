const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const regionRoute = require("./routes/regions")
const productRoute = require("./routes/products")
const listRoute = require("./routes/lists")
const appData = require("./routes/appdata")
const paymentData = require("./models/Payment")
const clientRoute = require("./routes/clients")


dotenv.config();

// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(process.env.MONGO_URL)
//     .then(() => console.log("DB connection Successfull!"))
//     .catch((err) => console.log(err));
// }

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB connection Successfull!"))
    .catch((err) => console.log(err));

app.use(express.json())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/regions", regionRoute)
app.use("/api/clients", clientRoute)
app.use("/api/products", productRoute)
app.use("/api/payments", paymentData)
app.use("/api/lists", listRoute)
app.use("/api/appdata", appData)


app.listen(8800, () => {
    console.log("Backend server is running!");
})