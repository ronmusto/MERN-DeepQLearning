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
                /*res.json({
                    username: user.username,
                    email: user.email
                });*/
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

    // Delete a specific booked vacation by its ID
    app.delete('/delete-booked-vacation/:bookingID', (req, res) => {
        const bookingID = new ObjectId(req.params.bookingID);

        db.collection('User-Bookings')
            .deleteOne({ _id: bookingID })
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Booking not found' });
                }
                res.json({ success: true, message: 'Booking deleted successfully' });
            })
            .catch(err => {
                console.error('Error deleting booked vacation:', err);
                res.status(500).json({ error: 'Failed to delete booked vacation' });
            });
    });

    // Update a specific booked vacation by its ID
    app.put('/update-booked-vacation/:bookingID', (req, res) => {
        const bookingID = new ObjectId(req.params.bookingID);
        const { startDate, endDate } = req.body;

        db.collection('User-Bookings')
            .updateOne({ _id: bookingID }, { $set: { startDate, endDate } })
            .then(result => {
                if (result.modifiedCount === 0) {
                    return res.status(404).json({ error: 'Booking not found or dates unchanged' });
                }
                res.json({ success: true, message: 'Booking dates updated successfully' });
            })
            .catch(err => {
                console.error('Error updating booked vacation:', err);
                res.status(500).json({ error: 'Failed to update booked vacation' });
            });
    });

};