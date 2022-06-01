const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/authentication");
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const cartRoute = require("./routes/cart");

const cors = require("cors");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to Mongo!');
    })
    .catch((err) => {
        console.error('Error connecting to Mongo', err);
    });

app.use(cors());
app.use(cookieParser());
app.use(express.json()); 
app.use("/api/authentication", authRoute);
app.use("/api/users",userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts" , cartRoute)


app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running!");
  });
