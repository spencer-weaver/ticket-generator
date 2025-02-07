
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

        await connection.query(`USE \`${dbConfig.database}\``);

        // create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTOINCREMENT PRIMARY KEY,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);

        // create tables table
        await connection.query(`CREATE TABLE IF NOT EXISTS tables (
                table_id INT AUTOINCREMENT PRIMARY KEY,
                table_number INT NOT NULL,
                seats INT NOT NULL,
                seats_taken INT NOT NULL DEFAULT 0
            );`);

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
    app.listen(port, '0.0.0.0', () => {
        console.log(`ticket generator database listening on port ${port}`);
    })

    // queries
    app.get('/test', async (req, res) => {
        try {
            const [rows] = await connection.execute('SHOW TABLES');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: 'database query failed' });
        }
    });

    app.get('/', async (req, res) => {
        try {
            const [rows] = await connection.execute('');
            res.json(rows);
        } catch {
            res.status(500).json({ error: 'database query failed' });
        }
    });
})();

