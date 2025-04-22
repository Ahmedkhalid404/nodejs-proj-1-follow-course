require('dotenv').config();
const cors = require('cors');
const express = require('express');
const courseRouter = require('./routes/course');
const userRouter = require('./routes/user');
const mongoose = require('mongoose');
const httpStatusText = require('./utils/httpStatusText');
const path = require('node:path');

const url = process.env.MONGO_URL;

mongoose.connect(url).then(()=>{
    console.log("mongo db connected successfully");
});

const app = express();
const port = process.env.PORT || 3000;



app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req,res,next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(cors());

app.use(express.json());
app.use('/api/courses', courseRouter);
app.use('/api/users', userRouter);


app.use( (err, req, res, next) => {
    res.status(err.status || 500).json({
        status : err.statusText || httpStatusText.ERROR,
        message : err.message || "Something wrong",
    });
});






app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});