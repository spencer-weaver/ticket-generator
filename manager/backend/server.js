
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = './data.json';

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ databases: [], events: [] }, null, 4));
}

function loadData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
}

// get requests

app.get('/events', (req, res) => {
    res.json(loadData().events);
})

app.get('/databases', (req, res) => {
    res.json(loadData().databases);
})

// post requests

app.post('/add-database', async (req, res) => {
    const { name, endpoint } = req.body;

    if (!name || !endpoint) {
        return res.status(400).json({ error: "name and endpoint are required." });
    }

    const data = loadData();

    // check if database already exists
    if (data.databases.some(db => db.name === name)) {
        return res.status(400).json({ error: "database name already exists." });
    }

    // add new database
    const newDatabase = { id: Date.now(), name, endpoint };
    data.databases.push(newDatabase);

    // save updated data
    saveData(data);

    res.status(201).json({ message: "database added successfully", database: newDatabase });
});

app.post('/remove-database', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "database name is required." });
    }

    const data = loadData();

    // check if the database exists
    const dbIndex = data.databases.findIndex(db => db.name === name);
    if (dbIndex === -1) {
        return res.status(404).json({ error: "database not found." });
    }

    // remove the database from the array
    data.databases.splice(dbIndex, 1);

    // save updated data to file
    saveData(data);

    res.status(200).json({ message: "database removed successfully." });
});

app.post('/add-event', async (req, res) => {
    const { name, database } = req.body;

    if (!name || !database) {
        return res.status(400).json({ error: "event name and database ID are required." });
    }

    const data = loadData();

    // checking if the name already exists
    if (data.events.some(event => event.name === name)) {
        return res.status(400).json({ error: "event name already exists." });
    }

    // check if the referenced database exists
    const dbExists = data.databases.some(db => db.name === database);
    if (!dbExists) {
        return res.status(400).json({ error: "referenced database does not exist." });
    }

    // add new event
    const newEvent = { id: Date.now(), name, database };
    data.events.push(newEvent);

    // save updated data
    saveData(data);

    res.status(201).json({ message: "event added successfully", event: newEvent });
});

app.post('/remove-event', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "event name is required." });
    }

    const data = loadData();

    // check if the event exists
    const eventIndex = data.events.findIndex(event => event.name === name);
    if (eventIndex === -1) {
        return res.status(404).json({ error: "event not found." });
    }

    // TODO: remove all event information, option to export first.

    // remove the event from the array
    data.events.splice(eventIndex, 1);

    // save updated data to file
    saveData(data);

    res.status(200).json({ message: "event removed successfully." });
});

// server
app.listen(port, () => {
    console.log(`ticket generator manager listening on port ${port}`);
})