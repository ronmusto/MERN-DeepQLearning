const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(app, db) {

    //Endpoints for login and registration
    app.post('/register', (req, res) => {
        const { email, username, password } = req.body;
        bcrypt.hash(password, saltRounds, function(err, hash) {
            const newUser = { email, username, password: hash };
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
};