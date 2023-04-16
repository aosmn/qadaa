import asyncHandler from 'express-async-handler';
import webpush from 'web-push';
import Subscription from '../models/subscription.model.js';

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
// Setup the public and private VAPID keys to web-push library.
webpush.setVapidDetails(
  'mailto:test@test.com',
  publicVapidKey,
  privateVapidKey
);

// @desc    subscribe to notification
// @route   POST /subscribe
// @access  private
export const subscribe = asyncHandler(async (req, res) => {
  const subscription = new Subscription({
    user: req.user._id,
    subscription: req.body.body
  });
  subscription.encryptSubscription();

  await Subscription.findOneAndUpdate(
    { user: req.user._id },
    {
      user: subscription.user,
      subscriptionHash: subscription.subscriptionHash
    },
    { upsert: true }
  );

  res.status(201).json({});
});

// @desc    subscribe to notification
// @route   POST /subscribe
// @access  private
export const unsubscribe = asyncHandler(async (req, res) => {
  const subscription = JSON.parse(req.body.body);
  await Subscription.deleteOne({ user: req.user._id });

  res.status(200).json({});
});

// // @desc    get all subscriptions
// // @route   GET /subscriptions
// // @access  Private
// export const getSubscriptions = asyncHandler(async (req, res) => {
//   const subscriptions = await Subscription.find(req.query);
//   res.json(subscriptions);
// });
