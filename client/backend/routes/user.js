const express = require('express');
const router = express.Router();
const Event = require('../models/event');

router.post('/create', async (req, res) => {
    try {
        const { name, numberOfTables, totalCapacity } = req.body;

        if (!name || !numberOfTables || !totalCapacity) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Calculate seats per table and handle rounding
        const seatsPerTable = Math.floor(totalCapacity / numberOfTables);
        const extraSeats = totalCapacity % numberOfTables; // Handle remainder

        // Create tables with seats inside
        const tables = [];
        let seatCounter = 1; // Global seat counter

        for (let i = 1; i <= numberOfTables; i++) {
            const tableSeatCount = seatsPerTable + (i <= extraSeats ? 1 : 0);
            const seats = [];

            for (let j = 1; j <= tableSeatCount; j++) {
                seats.push({
                    seatNumber: j,
                    isReserved: false
                });
                seatCounter++;
            }

            tables.push({
                tableNumber: i,
                capacity: tableSeatCount,
                availableSeats: tableSeatCount,
                seats
            });
        }

        const newEvent = new Event({
            name,
            numberOfTables,
            totalCapacity,
            currentCapacity: 0,
            tables
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create event' });
    }
});


router.get('/user/:userId', async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ error: 'Server error' });
    }
})

module.exports = router;
