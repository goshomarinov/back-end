const mongoose = require('mongoose');
require('../models/User');




const dbName = 'job-ads';

const connectionString = `mongodb://localhost:${process.env.PORT}/${dbName}`;


module.exports = async (app) => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Database connected');

        mongoose.connection.on('error', (err) => {
            console.error('Database error');
            console.error(err);
        });
    } catch (err) {
        console.error('Error connecting to database');
        process.exit(1);
    }
}