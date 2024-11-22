//// Import the Express framework to create a web server and handle routing
//const express = require('express');
//// Import the MySQL2 library with promise support for database interactions
//const mysql = require('mysql2/promise');
//// import bcrypt for password hashing
//const bcrypt = require('bcrypt');
//// import dotenv for environment variables
//const dotenv = require('dotenv');
//// import cors for cross-origin resource sharing
//const cors = require('cors');
//
//// load environment variables from a .env file
//dotenv.config();
//// run express app
//const app = express();
//// enable cross-origin resource sharing
//
//const corsOptions = {
//  origin: 'http://http://localhost:3001/API/adduser', // Replace with your Flutter app's URL or localhost IP
//  methods: ['POST'],
//  allowedHeaders: ['Content-Type', 'Authorization'],
//};
//app.use(cors(corsOptions));
//
//// use express built-in middleware to parse JSON
//app.use(express.json()); // Replacing bodyParser.json() with express's built-in middleware
//// declare a variable to hold the database connection
//
//
//// start the server
//app.listen(3001, () => {
//  console.log('Server is running on port 3001');
//});
//
//let db;
//// connect to the database
//async function connectToDatabase() {
//  try {
//    db = await mysql.createConnection({
//      host: process.env.DB_HOST, // database host
//      user: process.env.DB_USER, // database user
//      password: process.env.DB_PASSWORD, // database password
//      database: process.env.DB_NAME // database name
//    });
//    console.log('Connected to database'); // log successful database connection
//
//    // Call setupDatabase after successful connection
//    await setupDatabase(); // call setupDatabase to create the table and insert demo data
//  } catch (err) {
//    console.error('Error connecting to the database:', err); // log connection error
//    process.exit(1); // exit the process if database connection fails
//  }
//}
//
//// setupDatabase function creates a user table if it doesn't exist and inserts demo data
//async function setupDatabase() {
//  try {
//    const createTableQuery = `
//      CREATE TABLE IF NOT EXISTS userValue (
//        ID INT AUTO_INCREMENT PRIMARY KEY, -- unique ID for each user
//        username VARCHAR(20) NOT NULL, -- username of the user
//        user_password VARCHAR(255) NOT NULL, -- hashed password of the user
//        email VARCHAR(100) NOT NULL, -- email or phone of the user
//        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- timestamp of user creation
//      )
//    `;
//    await db.query(createTableQuery); // execute the query to create the table
//    console.log('Table created or already exists'); // log table creation success
//  } catch (err) {
//    console.error('Error setting up the database:', err); // log any error in setting up the database
//  }
//}
//
//
//
//
//
//// POST /adduser to add a new user to the database
//app.post('/adduser', async (req, res) => {
//  try {
//    console.log("Received Data:", req.body);
//
//    // Ensure required fields are present
//    if (!req.body.name || !req.body.password || !req.body.email) {
//      return res.status(400).send({
//        status_code: 400,
//        message: "Missing required fields: name, password, or email",
//      });
//    }
//
//    // Hash the password before storing it
//    const hashedPassword = await bcrypt.hash(req.body.password, 10);
//
//    // Insert the user into the database
//    const query = `
//      INSERT INTO userValue (username, password, email)
//      VALUES (?, ?, ?)
//    `;
//    const values = [req.body.name, hashedPassword, req.body.email];
//
//    const [result] = await db.execute(query, values); // Insert the user into the DB
//
//    console.log('User Added to Database:', {
//      id: result.insertId,
//      name: req.body.name,
//      email: req.body.email,
//    });
//
//    // Send response back to the client
//    res.status(200).send({
//      status_code: 200,
//      message: "User added successfully",
//      user: {
//        id: result.insertId,
//        name: req.body.name,
//        email: req.body.email,
//      },
//    });
//  } catch (err) {
//    console.error('Error adding user:', err);
//    res.status(500).send({
//      status_code: 500,
//      message: "Failed to add user",
//      error: err.message,
//    });
//  }
//});
// Import necessary libraries
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cors = require('cors');
const { generateJWT } = require('./jwtUtils');  // Import the generateJWT function

dotenv.config();
const app = express();

const corsOptions = {
  origin: 'http://localhost:3001/API/adduser',  // Frontend app URL
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());

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

// POST /login endpoint to authenticate user and send a JWT
app.post('/adduser', async (req, res) => {
  try {
    const { email, password } = req.body;
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
  await connectToDatabase();
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
})();
