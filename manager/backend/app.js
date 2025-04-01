// Importing dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // For environment variables

// Importing routes
const eventRouter = require('./routes/event');

// Creating the express app
const app = express();

// Middleware setup
app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded data
app.use(cookieParser());

// MongoDB connection
mongoose.set('strictQuery', false); // Avoid mongoose warnings
mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => console.log("MongoDB connection established successfully"))
    .catch((err) => console.error("MongoDB connection failed:", err));

// Routes
app.use("/", eventRouter); // Event-related routes

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Starting the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
