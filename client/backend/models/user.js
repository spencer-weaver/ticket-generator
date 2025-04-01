const mongoose = require('mongoose');

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
    emailPreferences: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
