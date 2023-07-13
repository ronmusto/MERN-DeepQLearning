const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const mongoURI = 'mongodb://localhost:27017/mydatabase'; // Update with your MongoDB connection string

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db(); // Get the database instance

    // Define your API routes here
    app.get('/users', (req, res) => {
      db.collection('users')
        .find()
        .toArray()
        .then(users => res.json(users))
        .catch(err => {
          console.error('Error retrieving users:', err);
          res.status(500).json({ error: 'Failed to retrieve users' });
        });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log('Connected to MongoDB');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
