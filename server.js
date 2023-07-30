const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieParser = require('cookie-parser');
const { ObjectId } = require('mongodb');

let fetch;
import('node-fetch').then(nodeFetch => {
  fetch = nodeFetch;
});

const app = express();
const port = 4200;
const mongoURI = 'mongodb://localhost:27017/MERN-DeepQLearning';
const secret = 'secret-key';

app.use(cors({
  origin: 'http://localhost:3000',  // replace with the origin of your client
  methods: ['GET', 'POST'],  // add other HTTP methods if needed
  credentials: true  // this enables cookies to be sent with requests
}));


app.use(cookieParser());

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

    app.get('/retail-data-2009-2010', (req, res) => {
      const limit = parseInt(req.query.limit) || 100; // default limit to 100 documents
      const skip = parseInt(req.query.skip) || 0;
    
      db.collection('retail-data-2009-2010')
        .find()
        .skip(skip)
        .limit(limit)
        .toArray()
        .then(data => res.json(data))
        .catch(err => {
          console.error('Error retrieving retail data:', err);
          res.status(500).json({ error: 'Failed to retrieve retail data' });
        });
    });
    
    
    app.get('/retail-data-2010-2011', (req, res) => {
      const limit = parseInt(req.query.limit) || 100; // default limit to 100 documents
      const skip = parseInt(req.query.skip) || 0;
    
      db.collection('retail-data-2010-2011')
        .find()
        .skip(skip)
        .limit(limit)
        .toArray()
        .then(data => res.json(data))
        .catch(err => {
          console.error('Error retrieving retail data:', err);
          res.status(500).json({ error: 'Failed to retrieve retail data' });
        });
    });
    
    
    app.post('/register', (req, res) => {
      const { email, password } = req.body;
      bcrypt.hash(password, saltRounds, function(err, hash) {
        const newUser = { email, password: hash };
        console.log('New user:', newUser);
        db.collection('users')
          .insertOne(newUser)
          .then(result => {
            console.log('Insert result:', result); 
            return db.collection('users').findOne({ _id: result.insertedId });
          })
          .then(user => {
            res.json({ user });
          })
          .catch(err => {
            console.error('Error registering user:', err);
            res.status(500).json({ error: 'Failed to register user', message: err.message });
          });
      });
    });
    
    app.post('/login', (req, res) => {
      const { email, password } = req.body;
      db.collection('users')
        .findOne({ email })
        .then(user => {
          if (user) {
            bcrypt.compare(password, user.password, function(err, result) {
              if(result) {
                const token = jwt.sign({ _id: user._id }, secret);
                res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });  // set cookie here
                res.json({ user }); 
              } else {
                res.status(401).json({ error: 'Invalid login credentials' });
              }
            });
          } else {
            res.status(401).json({ error: 'Invalid login credentials' });
          }
        })
        .catch(err => {
          console.error('Error logging in:', err);
          res.status(500).json({ error: 'Failed to login' });
        });
    });
    
    
    app.get('/verify', (req, res) => {
      const token = req.cookies.token;  // read the token from the cookie
      console.log('Token:', token);  // log the token
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          console.error('Token verification error:', err);
          return res.status(401).json({ error: 'Invalid token' });
        }
        const ObjectId = require('mongodb').ObjectId;
        const _id = new ObjectId(decoded._id);
        db.collection('users')
          .findOne({ _id })
          .then((user) => {
            console.log('User:', user);  // log the user
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