const { ObjectId } = require('mongodb');

module.exports = function(app, db) {

    //gets specific user by _id
    app.get('/user-data/:userID', (req, res) => {
        const userID = req.params.userID;

        db.collection('users')
            .findOne({ _id: new ObjectId(userID) })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json({
                    username: user.username,
                    email: user.email
                });
            })
            .catch(err => {
                console.error('Error retrieving user data:', err);
                res.status(500).json({ error: 'Failed to retrieve user data' });
            });
        });

    // Get user specific bookings
    app.get('/user-booked-vacations/:userID', (req, res) => {
        const userID = req.params.userID;

        db.collection('User-Bookings')
            .find({ userID })
            .toArray()
            .then(bookings => {
                res.json(bookings);
            })
            .catch(err => {
                console.error('Error retrieving booked vacations:', err);
                res.status(500).json({ error: 'Failed to retrieve booked vacations' });
            });
        });
};