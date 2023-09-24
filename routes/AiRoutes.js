const { spawn } = require('child_process');

module.exports = function(app, db) {    
    app.post('/predict', (req, res) => {
        const { input } = req.body;

        // Spawn a new Python process and run the prediction script
        const pythonProcess = spawn('python', ['./predict.py', JSON.stringify({ input: input })]);
        
        let result = '';
        let responseSent = false; // A flag to ensure we only send one response
        let errorMessages = '';

        pythonProcess.stdout.on('data', (data) => {
            // Collect the data returned from the Python script
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            // Accumulate error messages
            errorMessages += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (!responseSent) { // Ensure we haven't already sent a response
                if (code !== 0) {
                    console.error(errorMessages);
                    res.status(500).send('Error occurred during prediction.');
                } else {
                    // Send the response back to the client
                    res.json(JSON.parse(result));
                }
                responseSent = true; // Mark that a response has been sent
            }
        });
    });
}
