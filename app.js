const express = require('express');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');
const { PORT } = require('./config');
const farmController = require('./controller/farmController');

// Initialize App
const app = express();
app.use(cors());
app.use(express.json());
app.use(compression({
    level: 6
}))
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect('mongodb://localhost:27017/Farm', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connection Successful"))
    .catch((err) => console.log("Connection Failed", err))


app.get("/", async (req, res) => {
    let { name, key } = req.query;
    let data = { n: "req" };
    let ne = "await data".repeat(300000)
    res.json(ne)
})
// Application routes
app.use('/v1/farms', farmController)


// Default error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);
    res.status(500).json({ status: 0, message: err });
}


app.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
});
