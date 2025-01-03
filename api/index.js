const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const userRouter = require('./routes/user.route.js');
const authRouter = require('./routes/auth.route.js');
const newOrder = require('./routes/order.route.js');
const contact = require('./routes/contact.route.js');

const cookieParser = require("cookie-parser");
const path = require("path");
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB!');
}).catch((err) => {
    console.log(err);
})
const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/newOrder", newOrder);
app.use("/api/contact", contact);
// app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

//MiddleWare
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});