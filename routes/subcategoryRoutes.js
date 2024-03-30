// subcategoryRoutes.js

const express = require('express');
const router = express.Router();
const Subcategory = require('../models/subcategory');

// Route to insert a subcategory
router.post('/', async (req, res) => {
    try {
        const subcategory = await Subcategory.create(req.body);
        res.status(201).json(subcategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
