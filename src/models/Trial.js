import mongoose from 'mongoose';

const TrialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    lowercase: true,
    trim: true,
    index: true,
  },
  phone: {
    type: String,
    default: '',
  },
  goal: {
    type: String,
    required: [true, 'Please provide a goal'],
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  status: {
    type: String,
    enum: ['New', 'Replied'],
    default: 'New',
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  replySubject: {
    type: String,
  },
  replyMessage: {
    type: String,
  },
  repliedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

if (mongoose.models.Trial) {
  delete mongoose.models.Trial;
}

export default mongoose.models.Trial || mongoose.model('Trial', TrialSchema);
