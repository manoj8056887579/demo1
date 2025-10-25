import mongoose from 'mongoose';
import Admin from '../utils/admin/login/loginSchema.js';

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connections[0].readyState) {
      console.log('Already connected to MongoDB');
      return;
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Create initial admin after successful connection
    try {
      await Admin.createInitialAdmin();
    } catch (adminError) {
      console.error('Error creating initial admin:', adminError.message);
    }

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Do not exit the process in serverless environments — throw instead so
    // the caller/route can handle the error and respond with 5xx. Calling
    // process.exit(1) can terminate the function instance and produce
    // hard-to-debug failures (e.g., 405/500 responses). Rethrow here.
    throw error
  }
};

export default connectDB;