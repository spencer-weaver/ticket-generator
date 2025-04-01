const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: Number,
        required: true
    },
    isReserved: {
        type: Boolean,
        default: false
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
});

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    seats: [seatSchema]
});

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    numberOfTables: {
        type: Number,
        required: true
    },
    totalCapacity: {
        type: Number,
        required: true
    },
    currentCapacity: {
        type: Number,
        required: true,
        default: 0
    },
    tables: [tableSchema]
}, {
    timestamps: true
});

// Create a model from the schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
