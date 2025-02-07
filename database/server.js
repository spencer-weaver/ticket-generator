
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = 3001;

// database config
const dbConfig = {
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'event',
};

// connect to database
async function initializeDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
        });

        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);

        console.log('connected to database');
        return connection;
    } catch (error) {
        console.error('database connection failed', error);
        process.exit(1);
    }
}

(async () => {
    // wait for connection to database
    const connection = await initializeDatabase();

    // start server
    app.listen(port, () => {
        console.log(`ticket generator database listening on port ${port}`);
    })

    app.get('/test', async (req, res) => {
        try {
            const [rows] = await connection.execute('SHOW TABLES');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Database query failed' });
        }
    });
})();

