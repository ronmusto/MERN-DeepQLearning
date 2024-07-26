const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const { secret } = require('./config');

module.exports = (app, db) => {
    //Array of allowed origins (read from environment variables)
    const allowedOrigins = [process.env.HOST, process.env.HOSTTWO];

    //Custom CORS middleware
    app.use(cors({
        origin: (origin, callback) => {
            //Check if origin exists and is allowed
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);  //Allow the request
            } else {
                callback(new Error('Not allowed by CORS')); //Reject the request
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true //Enable cookies
    }));

    app.use(cookieParser());
    
    app.use(express.json());
    
    // Serve static files from the "images" directory
    app.use('/images', express.static('images'));
    
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
};
