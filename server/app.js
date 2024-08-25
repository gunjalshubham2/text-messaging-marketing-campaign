const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const routes = require('./route/message');

const app = express();

// Load environment variables from .env file
require('dotenv').config();

// Connect to Redis
const client = redis.createClient();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port', process.env.PORT || 3000);
});