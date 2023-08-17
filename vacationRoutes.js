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