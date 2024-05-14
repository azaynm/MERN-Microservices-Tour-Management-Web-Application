const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const activitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
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
    date: {
        type: Date,
        required: true
    },
    image:{
        type: String,
    }
}, { timestamps: true });

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
