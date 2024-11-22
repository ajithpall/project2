const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env

// Function to generate a JWT
function generateJWT(user) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  const secretKey = process.env.JWT_SECRET;  // Store the JWT secret key in .env

  // Set token expiration time (optional)
  const options = {
    expiresIn: '1h'  // Token will expire in 1 hour
  };

  // Generate JWT
  const token = jwt.sign(payload, secretKey, options);
  return token;
}

// Function to verify a JWT
function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

module.exports = { generateJWT, verifyJWT };
