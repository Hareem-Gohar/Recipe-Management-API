const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDb = async () => {
      if (mongoose.connection.readyState >= 1) {
            console.log('Already connected to MongoDB');
            return;
      }

      try {
            await mongoose.connect(process.env.MONGODB_URI, {
            });
            console.log('MongoDB connected successfully');
      } catch (err) {
            console.error('Error connecting to MongoDB:', err.message);
            process.exit(1); 
      }
};

module.exports = connectDb;
