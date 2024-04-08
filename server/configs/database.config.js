const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL, { dbName: process.env.DB_NAME })
    .then(() => console.log(`Database connection established with ${process.env.DB_NAME}`))
    .catch((err) => console.log('Could not establish mongoose connection', err));