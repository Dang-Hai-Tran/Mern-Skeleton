import config from '../config/config';
import app from './express';
import mongoose from 'mongoose';

// Mongoose
mongoose.Promise = global.Promise;
// Handle initial connection error
mongoose
    .connect(config.mongoUri)
    .then(console.log(`Initial connection to MongoDB is successful.`))
    .catch((error) => console.log(error));
mongoose.connection.on('error', () => {
    throw new Error(`Have error on connection to database at ${config.mongoUri}`);
});

app.listen(config.port, (err) => {
    if (err) {
        console.log(err);
    }
    console.info('Server started on port %s.', config.port);
});
