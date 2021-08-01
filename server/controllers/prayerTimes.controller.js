import Prayers from '../models/prayerLogs.model.js';
import asyncHandler from 'express-async-handler';
// import { ALL } from '../constants.js';
// import { fetchPrayerTimes } from '../utils/prayerTimes';
import axios from 'axios';
import day from 'dayjs';

// @desc    Get prayer times
// @route   GET /api/prayerTimes/:lat/:long/:method
// @access  Private
export const getPrayerTimes = asyncHandler(async (req, res) => {
  const { latitude, longitude, method } = req.query;
  let date = day();

  if (req.params.day) {
    date = day(req.params.day);
  }
  const prayerTimes = await axios
    .get(
      `http://api.aladhan.com/v1/timings/${date.unix()}?latitude=${latitude}&longitude=${longitude}&method=${
        method || 0
      }`
    )
    .then(res => {
      return res.data.data.timings;
    });
  res.json({ prayerTimes });
});

// @desc    Get prayer times
// @route   GET /api/prayerTimes/methods
// @access  Private
export const getCalculationMethods = asyncHandler(async (req, res) => {
  // const { latitude, longitude, method } = req.query;
  const methods = await axios
    .get('http://api.aladhan.com/v1/methods')
    .then(res => {
      return res.data.data;
    });
  res.json({ methods });
});

// // @desc    update user prayer log by day
// // @route   POST /api/prayers/
// // @access  Private
// // body {user, day, prayer, count}
// export const updateLogs = asyncHandler(async (req, res) => {
//   const prayers = await Prayers.updateDay({ ...req.body, user: req.user._id });
//   res.json(prayers);
// });

// // @desc    update user prayer log by day
// // @route   PUT /api/prayers/set
// // @access  Private
// // body {user, day, prayer, count}
// export const updateDayPrayers = asyncHandler(async (req, res) => {
//   const prayers = await Prayers.updateDayPrayers({
//     ...req.body,
//     user: req.user._id
//   });
//   res.json(prayers);
// });

// // @desc    update user prayer log by day
// // @route   POST /api/prayers/all
// // @access  Private
// // body {user, day, count}
// export const updateLogsAllDay = asyncHandler(async (req, res) => {
//   const prayers = await Prayers.updateDay({
//     ...req.body,
//     prayer: ALL,
//     user: req.user._id
//   });
//   res.json(prayers);
// });

// // @desc    Set user prayer log by day
// // @route   POST /api/prayers/set
// // @access  Private
// // body {day, prayers}
// export const setDayLogs = asyncHandler(async (req, res) => {
//   const prayers = await Prayers.setDay({ ...req.body, user: req.user._id });
//   res.json(prayers);
// });

// // @desc    get user prayer logs
// // @route   GET /api/prayers/day
// // @access  Private
// export const getDayLogs = asyncHandler(async (req, res) => {
//   let query = {};
//   if (req.query.day) {
//     let start = new Date(req.query.day);
//     start.setHours(0, 0, 0, 0);

//     let end = new Date(req.query.day);
//     end.setHours(23, 59, 59, 999);
//     query.$and = [{ day: { $lte: end } }, { day: { $gte: start } }];
//   }
//   query.user = req.user._id;
//   let fullQuery = { ...req.query, ...query };
//   delete fullQuery.day;
//   const prayers = await Prayers.findOne(fullQuery);
//   res.json(prayers);
// });

// // @desc    Get user total per prayer
// // @route   GET /api/prayers/totals/:id
// // @access  Private
// export const getAggregateLogs = asyncHandler(async (req, res) => {
//   const prayers = await Prayers.aggregate([
//     { $match: { user: req.user._id } },
//     {
//       $group: {
//         _id: '$user',
//         fajr: { $sum: '$fajr' },
//         dhuhr: { $sum: '$dhuhr' },
//         asr: { $sum: '$asr' },
//         maghrib: { $sum: '$maghrib' },
//         isha: { $sum: '$isha' },
//         total: { $sum: '$total' }
//       }
//     }
//   ]);
//   res.json(prayers);
// });
