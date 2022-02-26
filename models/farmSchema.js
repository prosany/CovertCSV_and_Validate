const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    farm_id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: [true, "Name can't be empty"],
        unique: [true, "Name should be unique"]
    },
    location: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = farmSchema;