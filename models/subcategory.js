const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    subcategoryName: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    created_date: {
        type: Date,
        default: Date.now
    }   
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
