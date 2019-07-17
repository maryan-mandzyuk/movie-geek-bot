const mongoose = require('mongoose')
const config = require('../../config')



module.exports = {
    connectionDb: function () {
        mongoose.set('useCreateIndex', true);

        mongoose.connect(config.dbConnect, {
            useNewUrlParser: true,
            useFindAndModify: false
        })
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Connection error: '));
        db.once('open', function (callback) {
            //The code in this asynchronous callback block is executed after connecting to MongoDB. 
            console.log('Successfully connected to MongoDB.');
        });
    },
}