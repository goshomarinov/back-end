const mongoose = require('mongoose');
require('../models/User');




const url = 'mongodb+srv://job-ads:krastavi4ak@cluster0.0przk.mongodb.net/jobAds?retryWrites=true&w=majority';

const connectionString = url;


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