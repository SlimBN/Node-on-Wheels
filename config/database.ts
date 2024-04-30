import mongoose, { ConnectOptions } from 'mongoose';

import dotenv from 'dotenv';

// Load .env file
dotenv.config();

interface CustomConnectOptions extends ConnectOptions {
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean; // Add this line
}

const options: CustomConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(process.env.MONGODB_URI!, options);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});