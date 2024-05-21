const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderedFoodSchema = new Schema({
    customerId: {
        type: String,
        required: true
    },
    orderedDate: {
        type: Date,
        default: Date.now // Set default to current date and time
    },
    total:{
        type: Number,
        required: true
    },
    foods: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        hotelId: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        ingredients: {
            type: [String],
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});

const OrderedFood = mongoose.model("OrderedFood", orderedFoodSchema);
module.exports = OrderedFood;
