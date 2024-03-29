import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const preferencesSchema = new mongoose.Schema({
  start: Date,
  end: Date,
  days: Number,
  isFemale: Boolean,
  period: Number,
  dailyTarget: {
    type: Number,
    default: 2
  },
  tutorialDone: {
    type: Boolean,
    default: false
  },
  trackHader: {
    type: Boolean,
    default: true
  }
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    },
    preferences: preferencesSchema
  },
  {
    timestamps: true
  }
);

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.setupPasswordReset = async function (
  token,
  expiresIn = 3600000
) {
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + expiresIn;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
