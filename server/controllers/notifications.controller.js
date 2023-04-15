import expressAsyncHandler from 'express-async-handler';
import webpush from 'web-push';

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
// Setup the public and private VAPID keys to web-push library.
webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);

// @desc    subscribe to notification
// @route   POST /subscribe
// @access  public
export const subscribe = expressAsyncHandler(async (req, res) => {
  const subscription = JSON.parse(req.body.body);
  res.status(201).json({});
  // const payload = JSON.stringify({ title: "Hello World", body: "This is your first push notification" });
  
  // webpush.sendNotification(subscription, payload).catch(console.log);
});
