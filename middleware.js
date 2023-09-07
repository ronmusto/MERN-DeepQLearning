const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const { secret } = require('./config');

module.exports = (app, db) => {
    app.use(cors({
        origin: process.env.HOST,
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
        credentials: true  // this enables cookies to be sent with requests
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
