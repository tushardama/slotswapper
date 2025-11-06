/**
 * Database Connection Module
 * 
 * Manages MongoDB connections with features:
 * - Connection pooling
 * - Global caching
 * - Error handling
 * - Environment configuration
 * 
 * Optimized for serverless environments to prevent connection exhaustion.
 * Implements connection reuse pattern for better performance.
 * 
 * @module lib/dbConnect
 */

import mongoose from 'mongoose';

// Global connection cache
let cached = global.mongoose;

// Initialize cache if not exists
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes and manages MongoDB connection with connection pooling
 * Uses global caching to prevent connection exhaustion in serverless environments
 * @returns {Promise<mongoose.Connection>} Active mongoose connection instance
 * @throws {Error} If MONGODB_URI is not configured or connection fails
 */
export async function dbConnect() {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      'MONGODB_URI environment variable is not defined. Please add it to your .env.local file.'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(uri, options)
      .then((mongooseInstance) => {
        console.log('MongoDB connected successfully');
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        console.error('MongoDB connection error:', error.message);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
