// Import the Express framework to create a web server and handle routing
const express = require('express');

// Import the MySQL2 library with promise support for database interactions
const mysql = require('mysql2/promise');

// import bcrypt for password hashing
const bcrypt = require('bcrypt');

// import dotenv for environment variables
const dotenv = require('dotenv');

//body-parser
const bodyParser = require('body-parser');

// import cors for cross-origin resource sharing
const cors = require('cors');

 //Import the generateJWT function
const { generateJWT } = require('./jwtUtils');

//attach cookie with income request
const cookieParser = require('cookie-parser');

// load environment variables from a .env file
dotenv.config();

// run express app
const app = express();

//path finder
const path = require('path');



// use express built-in middleware to parse JSON
//app.use(bodyParser.json());

// Parse JSON request bodies
app.use('/apiapp',express.json());

//corsoOptions connection
const corsOptions = {
  origin: 'http://http://localhost:3001', // check the url as same in api_source.dart end point
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// to say the app to use this cross options
app.use(cors(corsOptions));

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

console.log(__dirname);

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




// post response
app.post('/apiapp/API/adduser', async (req, res) => {
  try {

    const {name, password, email} = req.body; // Destructure the properties from req.body
    console.log('Received data:', { name, password, email });

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // post the value to the db
     const [result] = await db.query(
        'INSERT INTO userValue (username, user_password, email) VALUES (?, ?, ?)',
        [name, hashedPassword, email]
      );

    // Example response
    res.status(200).json({ message: 'User added successfully!' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Failed to add user.' });
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