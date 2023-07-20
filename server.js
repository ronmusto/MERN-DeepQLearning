const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
let fetch;
import('node-fetch').then(nodeFetch => {
  fetch = nodeFetch;
});

const app = express();
const port = 4200;
const mongoURI = 'mongodb://localhost:27017/MERN-DeepQLearning';
const secret = 'secret-key';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// JWT Middleware
app.use((req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      // Only access db when token is present and valid
      if (db) {
        db.collection('users')
          .findOne({ _id: decoded._id })
          .then(user => {
            req.user = user;  // Attach user to the request object
            next();
          })
          .catch(err => {
            console.error('Error retrieving user:', err);
            res.status(500).json({ error: 'Failed to retrieve user' });
          });
      } else {
        res.status(500).json({ error: 'Database not connected' });
      }
    });
  } else {
    next();
  }
});

let db;

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db();

    // Define API routes here
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

    app.post('/register', (req, res) => {
      const newUser = { 
        email: req.body.email, 
        password: req.body.password 
      };
      console.log('New user:', newUser);
      db.collection('users')
        .insertOne(newUser)
        .then(result => {
          console.log('Insert result:', result); 
          // Fetch the document that was just inserted
          return db.collection('users').findOne({ _id: result.insertedId });
        })
        .then(user => {
          // Send the user document back in the response
          res.json({ user });
        })
        .catch(err => {
          console.error('Error registering user:', err);
          res.status(500).json({ error: 'Failed to register user', message: err.message });
        });
    });

    app.post('/login', (req, res) => {
      const { email, password } = req.body;
      db.collection('users')
        .findOne({ email, password })
        .then(user => {
          if (user) {
            // Create a JWT and return it in the response
            const token = jwt.sign({ _id: user._id }, secret);
            res.json({ user, token }); // Include the user object in the response
          } else {
            res.status(401).json({ error: 'Invalid login credentials' });
          }
        })
        .catch(err => {
          console.error('Error logging in:', err);
          res.status(500).json({ error: 'Failed to login' });
        });
    });

    app.post('/verify', (req, res) => {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Invalid token' });
        }
    
        // Convert _id string to ObjectId
        const ObjectId = require('mongodb').ObjectId;
        const _id = new ObjectId(decoded._id);
        
        db.collection('users')
          .findOne({ _id })  // Use ObjectId in query
          .then((user) => {
            if (user) {
              res.json({ user });
            } else {
              res.status(401).json({ error: 'User not found' });
            }
          })
          .catch((err) => {
            console.error('Error retrieving user:', err);
            res.status(500).json({ error: 'Failed to retrieve user' });
          });
      });
    });
    
    

    app.post('/predict', async (req, res) => {
      const { input } = req.body;

      // Forward the request to the Flask server
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input })
      });

      // Send the response from the Flask server back to the client
      const data = await response.json();
      res.json(data);
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
