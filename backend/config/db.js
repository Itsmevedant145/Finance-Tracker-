const moongose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const connectDb = async () => {
    try {
        await moongose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit process with failure
    }
    }

module.exports = connectDb;
