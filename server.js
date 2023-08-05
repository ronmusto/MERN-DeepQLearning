const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieParser = require('cookie-parser');

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

    // Endpoint for aggregated data based on timeframe 2009-2010
    app.get('/retail-data-2009-2010-aggregated-timeframe', (req, res) => {
      const limit = parseInt(req.query.limit) || 100; // default limit to 100 documents
      const timeFrame = req.query.timeFrame || 'day'; // default timeframe to day

      let groupByExpression;
      switch (timeFrame) {
          case 'hour':
              groupByExpression = {
                  year: { $year: "$InvoiceDate" },
                  month: { $month: "$InvoiceDate" },
                  day: { $dayOfMonth: "$InvoiceDate" },
                  hour: { $hour: "$InvoiceDate" }
              };
              break;
          case 'day':
              groupByExpression = {
                  year: { $year: "$InvoiceDate" },
                  month: { $month: "$InvoiceDate" },
                  day: { $dayOfMonth: "$InvoiceDate" }
              };
              break;
          case 'week':
              groupByExpression = {
                  year: { $year: "$InvoiceDate" },
                  week: { $week: "$InvoiceDate" }
              };
              break;
          case 'month':
              groupByExpression = {
                  year: { $year: "$InvoiceDate" },
                  month: { $month: "$InvoiceDate" }
              };
              break;
          default:
              groupByExpression = {
                  year: { $year: "$InvoiceDate" },
                  month: { $month: "$InvoiceDate" },
                  day: { $dayOfMonth: "$InvoiceDate" }
              };
              break;
      }
      //collection to grab aggregated data from 2009-2010
      db.collection('retail-data-2009-2010')
          .aggregate([
              {
                  $match: {
                      Quantity: { $gte: 0 }  // Filter out cancelled orders
                  }
              },
              {
                  $group: {
                      _id: groupByExpression,
                      totalQuantity: { $sum: "$Quantity" },
                      totalSales: { $sum: { $multiply: ["$Quantity", "$Price"] } }
                  }
              },
              {
                  $sort: { "_id": 1 }  // sort by date in ascending order
              }
          ])
          .limit(limit)
          .toArray()
          .then(data => res.json(data))
          .catch(err => {
              console.error('Error retrieving aggregated retail data:', err);
              res.status(500).json({ error: 'Failed to retrieve aggregated retail data' });
          });
    });

    // Endpoint for aggregated data based on timeframe 2010-2011
    app.get('/retail-data-2010-2011-aggregated-timeframe', (req, res) => {
      const limit = parseInt(req.query.limit) || 100; // default limit to 100 documents
      const timeFrame = req.query.timeFrame || 'day'; // default timeframe to day

      let groupByExpression;
      switch (timeFrame) {
          case 'hour':
              groupByExpression = {
                  year: { $year: "$InvoiceDate" },
                  month: { $month: "$InvoiceDate" },
                  day: { $dayOfMonth: "$InvoiceDate" },
                  hour: { $hour: "$InvoiceDate" }
              };
              break;
          case 'day':
              groupByExpression = {
                  year: { $year: "$InvoiceDate" },
                  month: { $month: "$InvoiceDate" },
                  day: { $dayOfMonth: "$InvoiceDate" }
              };
              break;
          case 'week':
              groupByExpression = {
                  year: { $year: "$InvoiceDate" },
                  week: { $week: "$InvoiceDate" }
              };
              break;
          case 'month':
              groupByExpression = {
                  year: { $year: "$InvoiceDate" },
                  month: { $month: "$InvoiceDate" }
              };
              break;
          default:
              groupByExpression = {
                  year: { $year: "$InvoiceDate" },
                  month: { $month: "$InvoiceDate" },
                  day: { $dayOfMonth: "$InvoiceDate" }
              };
              break;
      }
      //collection to grab aggregated data from 2010-2011
      db.collection('retail-data-2010-2011')
          .aggregate([
              {
                  $match: {
                      Quantity: { $gte: 0 }  // Filter out cancelled orders
                  }
              },
              {
                  $group: {
                      _id: groupByExpression,
                      totalQuantity: { $sum: "$Quantity" },
                      totalSales: { $sum: { $multiply: ["$Quantity", "$Price"] } }
                  }
              },
              {
                  $sort: { "_id": 1 }  // sort by date in ascending order
              }
          ])
          .limit(limit)
          .toArray()
          .then(data => res.json(data))
          .catch(err => {
              console.error('Error retrieving aggregated retail data:', err);
              res.status(500).json({ error: 'Failed to retrieve aggregated retail data' });
          });
    });

    // Aggregate data by country for retail-data-2010-2011
    app.get('/aggregate-by-country-2010-2011', (req, res) => {
      db.collection('retail-data-2010-2011')  // replace with your actual collection name
          .aggregate([
              {
                  $group: {
                      _id: "$Country",  // Group by Country field
                      totalSales: {
                          $sum: {
                              $multiply: ["$Price", "$Quantity"]  // Calculate sales for each item
                          }
                      },
                      totalQuantity: { $sum: "$Quantity" }
                  }
              },
              {
                  $sort: { totalSales: -1 }  // sort in descending order
              }
          ])
          .toArray()
          .then(data => res.json(data))
          .catch(err => {
              console.error('Error retrieving aggregated data by country:', err);
              res.status(500).send('Internal Server Error');
          });
    });
    
    //Endpoints for login and registration
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

    //Sends request to flask server to have AI make prediction
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
