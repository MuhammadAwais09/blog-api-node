const mongoose = require("mongoose");

//create schema 
const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
    title: {
        type: String,
        required: true, 
    },
},{
    timestamps: true,
});

//Compile the category model
const category = mongoose.model('category', categorySchema);

module.exports = category;