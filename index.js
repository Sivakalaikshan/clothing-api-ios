// app.js or index.js

const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const brandRoutes = require('./routes/brandRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://root:root@atlascluster.kedmcse.mongodb.net/TrendSpotter?retryWrites=true&w=majority&appName=AtlasCluster', {}).then(() => {
    console.log('MongoDB connected');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Middleware
app.use(express.json());

// Routes
app.use('/products', productRoutes);
app.use('/brands', brandRoutes);
app.use('/category', categoryRoutes);
app.use('/subcategory', subcategoryRoutes);
app.use('/products', productRoutes);
app.use('/brands', brandRoutes);



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
