module.exports = function(app, db) {
    // Aggregate data by country for retail-data-2010-2011
    app.get('/aggregate-by-country-2009-2010', (req, res) => {
        db.collection('retail-data-2009-2010')
            .aggregate([
                {
                  $match: {
                      Quantity: { $gte: 0 }  // Filter out cancelled orders
                  }
                },
                {
                    $group: {
                        _id: "$Country",  // Group by Country field
                        totalSales: {
                            $sum: {
                                $multiply: ["$Price", "$Quantity"]  // Calculate sales for each item
                            }
                        },
                        totalQuantity: { $sum: "$Quantity" }
                    }
                },
                {
                    $sort: { totalSales: -1 }  // sort in descending order
                }
            ])
            .toArray()
            .then(data => {
              // Exclude the top country because the UK has so many sales
              const removeUK = data.slice(1);
      
              res.json(removeUK);
          })
            .catch(err => {
                console.error('Error retrieving aggregated data by country:', err);
                res.status(500).send('Internal Server Error');
            });
      });

    // Heatmap Data Endpoint
    app.get('/heatmap-data', (req, res) => {
        db.collection('retail-data-2010-2011')
        .aggregate([
            {
                $group: {
                    _id: "$Country",  // Group by Country field
                    totalSales: {
                        $sum: {
                            $multiply: ["$Price", "$Quantity"]  // Calculate sales for each item
                        }
                    },
                    totalQuantity: { $sum: "$Quantity" }
                }
            },
            {
                $sort: { totalSales: -1 }  // sort in descending order
            }
        ])
        .toArray()
        .then(data => {
            // Exclude the top country because the UK has so many sales it ruins the heatmap
            const filteredData = data.slice(6).filter(country => country.totalSales >= 10000);

            res.json(filteredData);
        })
        .catch(err => {
            console.error('Error retrieving aggregated data by country:', err);
            res.status(500).send('Internal Server Error');
        });
    });

    // Aggregate data by country for retail-data-2010-2011
    app.get('/aggregate-by-country-2010-2011', (req, res) => {
    db.collection('retail-data-2010-2011')
        .aggregate([
            {
                $group: {
                    _id: "$Country",  // Group by Country field
                    totalSales: {
                        $sum: {
                            $multiply: ["$Price", "$Quantity"]  // Calculate sales for each item
                        }
                    },
                    totalQuantity: { $sum: "$Quantity" }
                }
            },
            {
                $sort: { totalSales: -1 }  // sort in descending order
            }
        ])
        .toArray()
        .then(data => {
            // Exclude the top country because the UK has so many sales
            const removeUK = data.slice(1);

            res.json(removeUK);
        })
        .catch(err => {
            console.error('Error retrieving aggregated data by country:', err);
            res.status(500).send('Internal Server Error');
        });
    });
}