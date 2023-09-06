const { MongoClient } = require('mongodb');
const setupMiddleware = require('./middleware');
const express = require('express');

let fetch;
import('node-fetch').then(nodeFetch => {
  fetch = nodeFetch;
});

const app = express();
const port = process.env.PORT || 4200;
const mongoURI = process.env.AtlasURI;

let db;

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db();

    app.get('/health', (req, res) => {
      res.status(200).send('OK');
    });

    // Adds JWT, CORS, ect.
    setupMiddleware(app, db);
    // Import the user routes
    require('./routes/userRoutes')(app, db);
    // Import the vacation routes
    require('./routes/vacationRoutes')(app, db);
    // Import the country bar chart routes
    require('./routes/countryRoutes')(app, db);
    // Import the country bar-chart/heatmap routes
    require('./routes/timeSeriesRoutes')(app, db);
    // Import user auth routes
    require('./routes/userAuth')(app, db);
    // Import AI routes
    require('./routes/AiRoutes')(app, db);

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log('Connected to MongoDB');
      });
  })
  // Error if cannot establish MongoDB connection
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

  module.exports = app;