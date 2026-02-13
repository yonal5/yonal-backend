import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRoute.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/*
JWT AUTH MIDDLEWARE (FIXED)
*/
app.use((req, res, next) => {

    const header = req.header("Authorization");

    if (!header) {
        req.user = null;
        return next();
    }

    const token = header.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            req.user = null;
        } else {
            req.user = decoded;
        }

        next();

    });

});


/*
DATABASE CONNECTION (FIXED)
*/
mongoose.connect(process.env.MONGO_URI, {

    useNewUrlParser: true,
    useUnifiedTopology: true

})
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Connection Failed");
    console.log(err);
});


/*
ROUTES
*/
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);


/*
SERVER START
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
