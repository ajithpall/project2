// Import the Express framework to create a web server and handle routing
const express = require('express');

// Import the MySQL2 library with promise support for database interactions
const mysql = require('mysql2/promise');

// import bcrypt for password hashing
const bcrypt = require('bcrypt');

// import dotenv for environment variables
const dotenv = require('dotenv');

// import cors for cross-origin resource sharing
const cors = require('cors');

 //Import the generateJWT function
const { generateJWT } = require('./jwtUtils');

// load environment variables from a .env file
dotenv.config();

// run express app
const app = express();
// enable cross-origin resource sharing

const corsOptions = {
  origin: 'http://http://localhost:3001/API/adduser', // check the url as same in api_source.dart end point
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// to say the app to use this cross options
app.use(cors(corsOptions));

// use express built-in middleware to parse JSON
app.use(express.json());

// Hash the password before storing it
const hashedPassword = await bcrypt.hash(req.body.password, 10);

// connect to database
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



// setupDatabase function creates a user table if it doesn't exist and inserts demo data
async function setupDatabase() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS userValue (
        ID INT AUTO_INCREMENT PRIMARY KEY, -- unique ID for each user
        username VARCHAR(20) NOT NULL, -- username of the user
        user_password VARCHAR(255) NOT NULL, -- hashed password of the user
        email VARCHAR(100) NOT NULL, -- email or phone of the user
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- timestamp of user creation
      )
    `;
    await db.query(createTableQuery); // execute the query to create the table
    console.log('Table created or already exists'); // log table creation success
  } catch (err) {
    console.error('Error setting up the database:', err); // log any error in setting up the database
  }
}

// POST /login endpoint to authenticate user and send a JWT
app.post('/adduser', async (req, res) => {
  try {
    const jsonttt = req.body;
    const query = `SELECT * FROM userValue WHERE email = ?`;
    const [user] = await db.execute(query, [email]);

    if (!user || !user.length) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user[0].user_password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid password',
      });
    }

    // Generate JWT for the user
    const token = generateJWT(user[0]);

    // Send the JWT in the response
    res.status(200).json({
      message: 'Login successful',
      token: token,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Start server
(async () => {
  try {
    await connectToDatabase();
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
})()