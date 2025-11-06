/**
 * Swap Request Model
 * 
 * Mongoose schema for managing event exchange requests:
 * - Tracks swap participants (sender and target)
 * - Links involved events
 * - Manages request status workflow
 * 
 * Features:
 * - Indexed fields for efficient querying
 * - Status state management
 * - Automatic timestamps
 * - Referential integrity with Event model
 * 
 * @module lib/models/SwapRequest
 */

import mongoose from 'mongoose';

/**
 * MongoDB schema definition for SwapRequest collection
 * @typedef {Object} SwapRequestSchema
 */
const SwapRequestSchema = new mongoose.Schema(
  {
    senderUserId: {
      type: String,
      required: [true, 'Sender user ID is required'],
      index: true
    },
    targetUserId: {
      type: String,
      required: [true, 'Target user ID is required'],
      index: true
    },
    senderEventId: {
      type: String,
      required: [true, 'Sender event ID is required']
    },
    targetEventId: {
      type: String,
      required: [true, 'Target event ID is required']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected'],
        message: '{VALUE} is not a valid status'
      },
      default: 'pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

SwapRequestSchema.index({ targetUserId: 1, status: 1 });
SwapRequestSchema.index({ senderUserId: 1, status: 1 });

export default mongoose.models.SwapRequest || mongoose.model('SwapRequest', SwapRequestSchema);
