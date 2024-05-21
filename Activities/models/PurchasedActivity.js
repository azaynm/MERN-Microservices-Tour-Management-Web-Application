const mongoose = require('mongoose');
const { Schema } = mongoose;

const purchasedActivitySchema = new Schema({
    customerId: {
        type: String,
        required: true
    },
    orderedDate: {
        type: Date,
        default: Date.now // Set default to current date and time
    },
    total: {
        type: Number,
        required: true
    },
    activities: [{
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
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        participantsCount: {
            type: Number,
            required: true
        },
        cost: {
            type: Number,
            required: true
        },
        totalCost: {
            type: Number,
            required: true
        }
    }]
});

const PurchasedActivity = mongoose.model('PurchasedActivity', purchasedActivitySchema);

module.exports = PurchasedActivity;
