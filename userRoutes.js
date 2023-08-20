const { ObjectId } = require('mongodb');

module.exports = function(app, db) {

    //gets specific user by _id
    app.get('/user-data/:userId', (req, res) => {
        const userId = req.params.userId;

        db.collection('users')
            .findOne({ _id: new ObjectId(userId) })
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

    //get user specific bookings
    app.get('/user-booked-vacations/:userId', (req, res) => {
    const userId = req.params.userId;

    db.collection('User-Bookings')
        .find({ userId: new ObjectId(userId) })
        .toArray()
        .then(bookings => {
            const vacationIds = bookings.map(booking => ObjectId(booking.vacationId));
            return db.collection('User-Bookings')
                .find({ _id: { $in: vacationIds } })
                .toArray();
        })
        .then(vacations => {
            res.json(vacations);
        })
        .catch(err => {
            console.error('Error retrieving booked vacations:', err);
            res.status(500).json({ error: 'Failed to retrieve booked vacations' });
        });
    });
};