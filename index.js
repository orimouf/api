const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const regionRoute = require("./routes/regions")
const feesRoute = require("./routes/fees")
const productRoute = require("./routes/products")
const orderRoute = require("./routes/orders")
const orderedProductRoute = require("./routes/orderedProducts")
const appData = require("./routes/appdata")
const paymentData = require("./routes/payments")
const clientRoute = require("./routes/clients")
const factureRoute = require("./routes/facture")


dotenv.config();

// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(process.env.MONGO_URL)
//     .then(() => console.log("DB connection Successfull!"))
//     .catch((err) => console.log(err));
// }

//When the strict option is set to true,
//  Mongoose will ensure that only the fields that are specified 
// in your schema will be saved in the database, 
// and all other fields will not be saved (if some other fields are sent).

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB connection Successfull!"))
    .catch((err) => console.log(err));

app.use(express.json())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/regions", regionRoute)
app.use("/api/fees", feesRoute)
app.use("/api/clients", clientRoute)
app.use("/api/products", productRoute)
app.use("/api/payments", paymentData)
app.use("/api/orders", orderRoute)
app.use("/api/allproducts", orderedProductRoute)
app.use("/api/appdata", appData)
app.use("/api/factures", factureRoute)


app.listen(8800, () => {
    console.log("Backend server is running!");
})