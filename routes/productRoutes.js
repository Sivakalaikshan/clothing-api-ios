const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route to insert a product with image upload
router.post('/', upload.single('imageUrl'), async (req, res) => {
    try {
        // Extract other fields from req.body
        const { productName, description, price, brandId, categoryId, subcategoryId } = req.body;

        // Check if image file is provided
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        // Extract image filename from req.file
        const imageUrl = req.file.filename;

        // Create the product in the database with the image URL
        const product = await Product.create({
            productName,
            description,
            price,
            imageUrl,
            brandId,
            categoryId,
            subcategoryId
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.get('/get', async (req, res) => {
    try {
        const products = await Product.find()
            .populate('brandId', 'brandName')
            .populate('categoryId', 'categoryName')
            .populate('subcategoryId', 'subcategoryName')
            .select('productName price imageUrl');

        const productsWithDetails = products.map(product => {
            return {
                _id: product._id, // Include product ID
                productName: product.productName,
                brandName: product.brandId.brandName,
                categoryName: product.categoryId.categoryName,
                subcategoryName: product.subcategoryId.subcategoryName,
                price: product.price,
                imageUrl: product.imageUrl
            };
        });

        res.json(productsWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;
