const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to handle POST requests
app.post('/mental', (req, res) => {
  const receivedData = req.body;
  console.log(receivedData);

  // You can process the received data here, e.g., store it in a database, send a response, etc.

  res.json({ message: 'Data received successfully' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});