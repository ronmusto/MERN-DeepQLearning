// Find documents where StockCode is a string
db.collection('retail-data-2010-2011')
.find({ StockCode: { $type: 'string' } })
.toArray()
.then(docs => {
    // Iterate through the documents and clean the StockCode
    docs.forEach(doc => {
    const originalStockCode = doc.StockCode;
    // Remove any non-numeric characters from the StockCode
    const cleanedStockCode = parseInt(originalStockCode.replace(/\D/g, ''), 10);
    
    // Update the document with the cleaned StockCode
    db.collection('retail-data-2010-2011')
        .updateOne({ _id: doc._id }, { $set: { StockCode: cleanedStockCode } })
        .then(() => {
        console.log(`Updated StockCode from ${originalStockCode} to ${cleanedStockCode}`);
        })
        .catch(err => console.error('Error updating document:', err));
    });
})
.catch(err => console.error('Error finding documents:', err));

// Find documents where StockCode is NaN
db.collection('retail-data-2010-2011')
.find({ StockCode: NaN })
.toArray()
.then(docs => {
    // Iterate through the documents and delete the ones with StockCode as NaN
    docs.forEach(doc => {
    db.collection('retail-data-2010-2011')
        .deleteOne({ _id: doc._id })
        .then(() => {
        console.log(`Deleted document with StockCode NaN`);
        })
        .catch(err => console.error('Error deleting document:', err));
    });
})
.catch(err => console.error('Error finding documents with NaN StockCode:', err));