const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [String],
    price: { type: Number, required: true },
    cuisines:{
        type:String,
        enum: ["Italian Cuisine", "Japanese Cuisine", "Indian Cuisine", "French Cuisine"],
    },
    hotelId: { type: String, required: true },
    image: { type: String, required: true }
});


const Food = mongoose.model("Food", foodSchema);
module.exports = Food;