const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/create', async (req, res) => {
    try {
        const { accessCode, firstName, lastName, email, dietaryPreferences, emailPreferences } = req.body;

        if (!accessCode || !firstName || !lastName || !email || !dietaryPreferences || !emailPreferences) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const tableNumber = 0;
        const seatNumber = 0;


        const newUser = new User({
            firstName,
            lastName,
            email,
            tableNumber,
            seatNumber,
            dietaryPreferences,
            emailPreferences
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', event: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create user' });
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
