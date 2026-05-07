import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tier: {
    type: String,
    enum: ['basic', 'pro', 'elite'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Expired', 'Rejected', 'Superseded'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
  },
  billingCycle: {
    type: String,
    enum: ['Monthly', 'Annual'],
  },
  startDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  transactionRef: {
    type: String,
    default: () => Math.random().toString(36).substring(2, 15),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
