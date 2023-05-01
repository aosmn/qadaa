import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import sendMessage from '../utils/sendEmail.js';

// @desc    Authenticate user and get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      preferences: user.preferences || {}
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user by token
// @route   POST /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // const { token } = req.body;
  const user = req.user;
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      preferences: user.preferences || {}
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isFemale } = req.body;
  // console.log(isFemale);
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const userToCreate = {
    name,
    email,
    password
  };
  if (isFemale) {
    userToCreate.preferences = { isFemale: true, period: 5 };
  }
  const user = await User.create(userToCreate);
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      preferences: user.preferences || {}
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Update user
// @route   PUT /api/users
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
      preferences: updatedUser.preferences || {}
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Recover Password - Generates token and sends pasword reset email
// @route   POST /api/users/recover
// @access  Public
const sendPasswordReset = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = generateToken(user._id, '1d');
    user.setupPasswordReset(token, 3600000);
    const savedUser = await user.save();
    const link = `${req.headers.origin}/reset-password?token=${savedUser.resetPasswordToken}&email=${savedUser.email}`;
    const subject = 'Password reset link';
    const to = savedUser.email;

    const templateId = process.env.PASSWORD_RESET_TEMPLATE;
    const data = {
      user_name: savedUser.name.split(' ')[0],
      reset_url: link
    };

    sendMessage({ to, subject, templateId, data })
      .then(() => {
        console.log('sent');
        res.status(200).json({
          message: `A reset email was sent to ${savedUser.email}`
        });
      })
      .catch(error => {
        res.status(500);
        throw new Error(error);
      });
  } else {
    res.status(404);
    throw new Error(
      `The email ${req.body.email} isn't associated with any account. Double-check your email address and try again`
    );
  }
});

// @desc    Reset Password - Validate pasword reset token and authorize password reset
// @route   POST /api/users/reset-password
// @access  Public
const passwordReset = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    resetPasswordToken: req.body.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (user) {
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const savedUser = await user.save();

    res.status(200).json({
      message: `Success! Password reset done for ${savedUser.email}`
    });
  } else {
    res.status(401);
    throw new Error('Password reset token is invalid or has expired');
  }
});

// @desc    Update user preferences
// @route   PUT /api/users/prefs
// @access  Private
const updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const prefs = user.preferences;
    const preferences = req.body;
    const set = {};
    for (const field in preferences) {
      if (Object.hasOwnProperty.call(preferences, field)) {
        set[`preferences.${field}`] = preferences[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: set },
      { new: true }
    );

    res.json({
      preferences: updatedUser.preferences
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
export {
  authUser,
  registerUser,
  updateUser,
  sendPasswordReset,
  passwordReset,
  updatePreferences,
  getMe
};
