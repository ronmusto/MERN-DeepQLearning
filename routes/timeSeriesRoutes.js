    module.exports = function(app, db) { 
    // Endpoint for aggregated data based on timeframe 2009-2010
    app.get('/retail-data-2009-2010-aggregated-timeframe', (req, res) => {
        const limit = parseInt(req.query.limit) || 100; // default limit to 100 documents
        const timeFrame = req.query.timeFrame || 'day'; // default timeframe to day
  
        let groupByExpression;
        switch (timeFrame) {
            case 'hour':
                groupByExpression = {
                    year: { $year: "$InvoiceDate" },
                    month: { $month: "$InvoiceDate" },
                    day: { $dayOfMonth: "$InvoiceDate" },
                    hour: { $hour: "$InvoiceDate" }
                };
                break;
            case 'day':
                groupByExpression = {
                    year: { $year: "$InvoiceDate" },
                    month: { $month: "$InvoiceDate" },
                    day: { $dayOfMonth: "$InvoiceDate" }
                };
                break;
            case 'week':
                groupByExpression = {
                    year: { $year: "$InvoiceDate" },
                    week: { $week: "$InvoiceDate" }
                };
                break;
            case 'month':
                groupByExpression = {
                    year: { $year: "$InvoiceDate" },
                    month: { $month: "$InvoiceDate" }
                };
                break;
            default:
                groupByExpression = {
                    year: { $year: "$InvoiceDate" },
                    month: { $month: "$InvoiceDate" },
                    day: { $dayOfMonth: "$InvoiceDate" }
                };
                break;
        }
        //collection to grab aggregated data from 2009-2010
        db.collection('retail-data-2009-2010')
            .aggregate([
                {
                    $match: {
                        Quantity: { $gte: 0 }  // Filter out cancelled orders
                    }
                },
                {
                    $group: {
                        _id: groupByExpression,
                        totalQuantity: { $sum: "$Quantity" },
                        totalSales: { $sum: { $multiply: ["$Quantity", "$Price"] } }
                    }
                },
                {
                    $sort: { "_id": 1 }  // sort by date in ascending order
                }
            ])
            .limit(limit)
            .toArray()
            .then(data => res.json(data))
            .catch(err => {
                console.error('Error retrieving aggregated retail data:', err);
                res.status(500).json({ error: 'Failed to retrieve aggregated retail data' });
            });
      });    
    
    // Endpoint for aggregated data based on timeframe 2010-2011
    app.get('/retail-data-2010-2011-aggregated-timeframe', (req, res) => {
        const limit = parseInt(req.query.limit) || 100; // default limit to 100 documents
        const timeFrame = req.query.timeFrame || 'day'; // default timeframe to day
  
        let groupByExpression;
        switch (timeFrame) {
            case 'hour':
                groupByExpression = {
                    year: { $year: "$InvoiceDate" },
                    month: { $month: "$InvoiceDate" },
                    day: { $dayOfMonth: "$InvoiceDate" },
                    hour: { $hour: "$InvoiceDate" }
                };
                break;
            case 'day':
                groupByExpression = {
                    year: { $year: "$InvoiceDate" },
                    month: { $month: "$InvoiceDate" },
                    day: { $dayOfMonth: "$InvoiceDate" }
                };
                break;
            case 'week':
                groupByExpression = {
                    year: { $year: "$InvoiceDate" },
                    week: { $week: "$InvoiceDate" }
                };
                break;
            case 'month':
                groupByExpression = {
                    year: { $year: "$InvoiceDate" },
                    month: { $month: "$InvoiceDate" }
                };
                break;
            default:
                groupByExpression = {
                    year: { $year: "$InvoiceDate" },
                    month: { $month: "$InvoiceDate" },
                    day: { $dayOfMonth: "$InvoiceDate" }
                };
                break;
        }
        //collection to grab aggregated data from 2010-2011
        db.collection('retail-data-2010-2011')
            .aggregate([
                {
                    $match: {
                        Quantity: { $gte: 0 }  // Filter out cancelled orders
                    }
                },
                {
                    $group: {
                        _id: groupByExpression,
                        totalQuantity: { $sum: "$Quantity" },
                        totalSales: { $sum: { $multiply: ["$Quantity", "$Price"] } }
                    }
                },
                {
                    $sort: { "_id": 1 }  // sort by date in ascending order
                }
            ])
            .limit(limit)
            .toArray()
            .then(data => {res.json(data);})
            .catch(err => {
                console.error('Error retrieving aggregated retail data:', err);
                res.status(500).json({ error: 'Failed to retrieve aggregated retail data' });
            });
      });
}