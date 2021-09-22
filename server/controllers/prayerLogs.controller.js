import Prayers from '../models/prayerLogs.model.js';
import asyncHandler from 'express-async-handler';
import { ALL } from '../constants.js';
import day from 'dayjs';
// @desc    Get user prayer logs
// @route   GET /api/prayers/:id
// @access  Private
export const getLogs = asyncHandler(async (req, res) => {
  const prayers = await Prayers.find({ user: req.user._id }).sort({ day: -1 });
  res.json({ prayers });
});

// @desc    update user prayer log by day
// @route   POST /api/prayers/
// @access  Private
// body {user, day, prayer, count}
export const updateLogs = asyncHandler(async (req, res) => {
  const prayers = await Prayers.updateDay({ ...req.body, user: req.user._id });
  res.json(prayers);
});

// @desc    update user prayer log by day
// @route   PUT /api/prayers/set
// @access  Private
// body {user, day, prayer, count}
export const updateDayPrayers = asyncHandler(async (req, res) => {
  const prayers = await Prayers.updateDayPrayers({
    ...req.body,
    user: req.user._id
  });
  res.json(prayers);
});

// @desc    update user prayer log by day
// @route   POST /api/prayers/all
// @access  Private
// body {user, day, count}
export const updateLogsAllDay = asyncHandler(async (req, res) => {
  const prayers = await Prayers.updateDay({
    ...req.body,
    prayer: ALL,
    user: req.user._id
  });
  res.json(prayers);
});

// @desc    Set user prayer log by day
// @route   POST /api/prayers/set
// @access  Private
// body {day, prayers}
export const setDayLogs = asyncHandler(async (req, res) => {
  const prayers = await Prayers.setDay({ ...req.body, user: req.user._id });
  res.json(prayers);
});

// @desc    get user prayer logs
// @route   GET /api/prayers/day
// @access  Private
export const getDayLogs = asyncHandler(async (req, res) => {
  let query = {};
  console.log(req.query.day.day);
  console.log(req.query.day.tz);
  console.log(day(req.query.day).format());
  if (req.query.day) {
    let start = day(req.query.day).startOf('day');
    let end = day(req.query.day).endOf('day');
    query.$and = [{ day: { $lte: end } }, { day: { $gte: start } }];
    console.log(start.format());
    console.log(end.format());
  }
  query.user = req.user._id;
  let fullQuery = { ...req.query, ...query };
  delete fullQuery.day;
  const prayers = await Prayers.findOne(fullQuery);
  res.json(prayers);
});

// @desc    Get user total per prayer
// @route   GET /api/prayers/totals/:id
// @access  Private
export const getAggregateLogs = asyncHandler(async (req, res) => {
  const prayers = await Prayers.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: '$user',
        fajr: { $sum: '$fajr' },
        dhuhr: { $sum: '$dhuhr' },
        asr: { $sum: '$asr' },
        maghrib: { $sum: '$maghrib' },
        isha: { $sum: '$isha' },
        total: { $sum: '$total' }
      }
    }
  ]);
  res.json(prayers);
});
