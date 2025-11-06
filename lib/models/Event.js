/**
 * Event Model
 * 
 * Mongoose schema for managing calendar events:
 * - Event details (title, time range)
 * - Swap status tracking
 * - User ownership
 * 
 * Features:
 * - Time format validation
 * - Status state management
 * - Efficient indexing
 * - Data integrity constraints
 * - Automatic timestamps
 * 
 * @module lib/models/Event
 */

import mongoose from 'mongoose';

/**
 * MongoDB schema definition for Event collection
 * @typedef {Object} EventSchema
 */
const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
      validate: {
        validator: function(v) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: 'Date must be in YYYY-MM-DD format'
      }
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      validate: {
        validator: function(v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Start time must be in HH:MM format'
      }
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      validate: {
        validator: function(v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'End time must be in HH:MM format'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['Swappable', 'Swap Pending', 'Swapped', 'Non-Swappable'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Swappable'
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true
    }
  },
  {
    timestamps: true
  }
);

EventSchema.index({ userId: 1, date: 1 });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
