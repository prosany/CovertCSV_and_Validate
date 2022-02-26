const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const farmSchema = require('../models/farmSchema');
const Farm = new mongoose.model("Farm", farmSchema);
const { patternTwo } = require('../helper/generateId');

// Get All The Farms
router.get('/', async (req, res) => {
    await Farm.find({}).select({
        _id: 0,
        __v: 0
    }).exec((err, doc) => {
        if (err) return res.status(500).json({ status: 0, message: "Error finding data" });
        res.status(200).json({ status: 1, results: doc })
    })
});

// Get Single Farms by Id
router.get('/:id', async (req, res) => {
    let { id } = req.params;
    await Farm.findOne({ farm_id: id }).select({
        _id: 0,
        __v: 0
    }).exec((err, doc) => {
        if (err || doc === null) return res.status(500).json({ status: 0, message: "Error fetching data or farm not found" });
        res.status(200).json({ status: 1, results: doc })
    })
});

// Create a Farm
router.post('/', async (req, res) => {
    let { name, location } = req.body;
    const newFarm = new Farm({
        farm_id: patternTwo(4),
        name: name,
        location: location
    });
    newFarm.save((err, doc) => {
        if (err) return res.status(500).json({ status: 0, message: err.message });
        res.status(201).json({ status: 1, message: doc })
    })
});

// Create Multiple Farm
router.post('/multi', async (req, res) => {
    let data = req.body;
    let finalData = [];

    data.forEach((data) => {
        const newFarm = {
            farm_id: patternTwo(4),
            name: data.name,
            location: data.location
        };
        finalData.push(newFarm)
    });

    await Farm.insertMany(finalData, (err, doc) => {
        if (err) return res.status(500).json({ status: 0, message: err + "Farm creation failed" });
        res.status(201).json({ status: 1, message: "Farms were created successfully", results: doc })
    })
});

// Put a Farm
router.put('/:id', async (req, res) => { });

module.exports = router;