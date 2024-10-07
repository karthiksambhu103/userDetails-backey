const express = require('express');
 const cors = require('cors');
const connectToMongo = require('./db');

connectToMongo();
const app = express();
const port = 3001;

const corsOptions = {
  origin: 'https://userdetails20krs.netlify.app', // Your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token'] // Allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'));


app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`);
});