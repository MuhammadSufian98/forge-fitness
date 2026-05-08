import mongoose from 'mongoose';

const ChatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'New Session',
    trim: true,
  },
  messages: [
    {
      role: {
        type: String,
        enum: ['user', 'ai', 'system'],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Update lastMessageAt before saving if messages changed
ChatSessionSchema.pre('save', function() {
  if (this.isModified('messages')) {
    this.lastMessageAt = Date.now();
  }
});

export default mongoose.models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);
