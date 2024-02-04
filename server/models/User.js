import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
      type: String,
      required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ["General", "OBC", "SC/ST"],
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
