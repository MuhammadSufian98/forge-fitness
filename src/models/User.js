import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['admin', 'coach', 'athlete'],
    default: 'athlete',
  },
  profileImage: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  // Coach Specific
  accreditations: {
    type: [String],
    default: [],
  },
  classesCount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  retentionRate: {
    type: Number,
    default: 0,
  },
  coachingPhilosophy: {
    type: String,
    default: '',
  },
  // Athlete Specific
  fitnessGoals: {
    type: String,
    default: '',
  },
  trialStatus: {
    type: String,
    enum: ['none', 'active', 'expired'],
    default: 'none',
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'basic', 'premium', 'elite', 'pro'], // Added pro as per prompt requirement (Basic/Pro/Elite)
    default: 'free',
  },
  subscriptionRef: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  }],
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active',
  },
  // Athlete Metrics
  kcal: {
    type: Number,
    default: 0,
  },
  activeMinutes: {
    type: Number,
    default: 0,
  },
  heartRate: {
    type: Number,
    default: 0,
  },
  sleepScore: {
    type: Number,
    default: 0,
  },
  // Admin Specific
  clearanceLevel: {
    type: Number,
    default: 1,
  },
  hubAccess: {
    type: [String],
    default: [],
  },
  adminNotes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
