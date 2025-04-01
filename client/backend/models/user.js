const mongoose = require('mongoose');

// Define the schema for an event
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    tableNumber: {
        type: Number,
        required: true
    },
    seatNumber: {
        type: Number,
        required: true
    },
    dietaryPreferences: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
