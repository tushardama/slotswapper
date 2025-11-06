/**
 * User Model
 * 
 * Mongoose schema for user data management:
 * - Personal information (name, email)
 * - Authentication credentials
 * - Account metadata
 * 
 * Features:
 * - Email uniqueness validation
 * - Password requirements enforcement
 * - Automatic timestamps
 * - Input sanitization
 * 
 * @module lib/models/User
 */

import mongoose from 'mongoose';

/**
 * MongoDB schema definition for User collection
 * @typedef {Object} UserSchema
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format'
      },
      index: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
