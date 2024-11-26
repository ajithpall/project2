// Import necessary packages
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Create the Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3001', // Correct URL
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Database connection setup
let db;
async function connectToDatabase() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
}

// Setup database table if not exists
async function setupDatabase() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS userValue (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(20) NOT NULL,
        user_password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(createTableQuery);
    console.log('Table created or already exists');
  } catch (err) {
    console.error('Error setting up the database:', err);
  }
}

// POST endpoint to add user
app.get('/test', async (req, res) => {
  try {
    const { name, password, email } = req.body; // Destructure the request body
    console.log('Received data:', { name, password, email });

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user data into the database
    const insertQuery = `INSERT INTO userValue (username, user_password, email) VALUES (?, ?, ?)`;
    await db.query(insertQuery, [name, hashedPassword, email]);

    // Send success response
    res.status(200).json({ message: 'User added successfully!' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Failed to add user.' });
  }
});

// Start the server and connect to the database
(async () => {
  try {
    await connectToDatabase();
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
})();
