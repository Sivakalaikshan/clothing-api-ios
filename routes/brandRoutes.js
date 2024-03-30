// brandRoutes.js

const express = require('express');
const router = express.Router();
const Brand = require('../models/brand');

// Route to insert a brand
router.post('/', async (req, res) => {
    try {
        const brand = await Brand.create(req.body);
        res.status(201).json(brand);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
