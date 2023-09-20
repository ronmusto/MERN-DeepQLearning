    
module.exports = function(app, db) {    
    //Sends request to flask server to have AI make prediction
    app.post('/predict', async (req, res) => {
        const { input } = req.body;
  
        // Forward the request to the Flask server
        const response = await fetch(process.env.AiHOST, {
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
}