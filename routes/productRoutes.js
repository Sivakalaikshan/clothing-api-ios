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
router.post('/', async (req, res) => {
    try {
        // Extract other fields from req.body
        const { productName, price, imageUrl, brandId, categoryId, subcategoryId } = req.body;

        // Check if image file is provided
       

        // Create the product in the database with the image URL
        const product = await Product.create({
            productName,
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

router.get('/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId)
            .populate('brandId', 'brandName')
            .populate('categoryId', 'categoryName')
            .populate('subcategoryId', 'subcategoryName')
            .select('productName price imageUrl');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productDetails = {
            _id: product._id,
            productName: product.productName,
            brandName: product.brandId.brandName,
            categoryName: product.categoryId.categoryName,
            subcategoryName: product.subcategoryId.subcategoryName,
            price: product.price,
            imageUrl: product.imageUrl
        };

        res.json(productDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.get('/products/:brandName', async (req, res) => {
    const brandName = req.params.brandName;

    try {
        // Find the products associated with the specified brand name and populate referenced fields
        const products = await Product.find({}).populate('brandId').populate('categoryId').populate('subcategoryId').exec();

        // Filter products by brandName
        const filteredProducts = products.filter(product => product.brandId && product.brandId.brandName === brandName);

        if (filteredProducts.length === 0) {
            return res.status(404).json({ message: 'No products found for the specified brand.' });
        }

        // Construct the response object with desired fields
        const responseData = filteredProducts.map(product => ({
            productName: product.productName,
            brandName: product.brandId.brandName,
            categoryName: product.categoryId ? product.categoryId.categoryName : null,
            subcategoryName: product.subcategoryId ? product.subcategoryId.subcategoryName : null,
            price: product.price,
            imageUrl: product.imageUrl
        }));

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;
