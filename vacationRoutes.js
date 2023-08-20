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
        // Extract booking details from the request body
        const { vacationDetails, userBookingDetails } = req.body;
    
        // Combine the vacation and booking details (you can structure this as needed)
        const combinedBooking = {
            ...vacationDetails,
            userDetails: userBookingDetails,
            bookingDate: new Date() // You can store the booking date if needed
        };
    
        // Insert the combined booking into the Bookings collection
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