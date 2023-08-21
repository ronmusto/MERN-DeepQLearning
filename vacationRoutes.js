const { ObjectId } = require('mongodb');

module.exports = function(app, db) {

    // Get all vacations
    app.get('/vacations', (req, res) => {
      db.collection('Vacations')
        .find()
        .toArray()
        .then(vacations => res.json(vacations))
        .catch(err => {
          console.error('Error retrieving vacations:', err);
          res.status(500).json({ error: 'Failed to retrieve vacations' });
        });
      });
      
    // Send booked vacation to database
    app.post('/bookVacation', (req, res) => {
      // Extract booking details, including userId, from the request body
      console.log(req.body)
      const { userID, vacationDetails, userBookingDetails } = req.body;

      // Combine the userId, vacation, and booking details
      const combinedBooking = {
          userID,
          vacationDetails: { ...vacationDetails, _id: undefined },
          userDetails: userBookingDetails,
          bookingDate: new Date()
      };

      // Insert the combined booking into the User-Bookings collection
      db.collection('User-Bookings')
        .insertOne(combinedBooking)
        .then(result => {
          // Send a success response
          res.json({ success: true, message: 'Booking successful', bookingId: result.insertedId });
        })
        .catch(err => {
          console.error('Error saving booking:', err);
          res.status(500).json({ error: 'Failed to save booking' });
        });
      });

    // Get specific vacation by _id
    app.get('/vacation/:id', (req, res) => {
      const vacationId = new ObjectId(req.params.id); // Convert string ID to ObjectId
      db.collection('Vacations')
        .findOne({ _id: vacationId })
        .then(vacation => {
          if (!vacation) {
            return res.status(404).json({ error: 'Vacation not found' });
          }
          res.json(vacation);
        })
        .catch(err => {
          console.error('Error retrieving vacation:', err);
          res.status(500).json({ error: 'Failed to retrieve vacation' });
        });
    });
}