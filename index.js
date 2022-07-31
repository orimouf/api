const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const productRoute = require("./routes/products")
const listRoute = require("./routes/lists")

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
app.use("/api/products", productRoute)
app.use("/api/lists", listRoute)


app.listen(8800, () => {
    console.log("Backend server is running!");
})