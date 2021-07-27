import DayPrayers from '../models/dayPrayerLogs.model.js';
import asyncHandler from 'express-async-handler';
import {ALL} from '../constants.js'

// @desc    Get user prayer logs
// @route   GET /api/dayPrayers/:id
// @access  Private
export const getLogs = asyncHandler(async (req, res) => {
  const prayers = await DayPrayers.find({ user: req.user._id }).sort({day: -1});
  res.json({prayers});
});

// @desc    update user prayer log by day
// @route   POST /api/dayPrayers/
// @access  Private
// body {user, day, prayer, count}
export const updateLogs = asyncHandler(async (req, res) => {
  const prayers = await DayPrayers.updateDay({...req.body, user: req.user._id });
  res.json(prayers);
});

// // @desc    update user prayer log by day
// // @route   PUT /api/dayPrayers/set
// // @access  Private
// // body {user, day, prayer, count}
export const updateDayPrayers = asyncHandler(async (req, res) => {
  const prayers = await DayPrayers.updateDayPrayers({...req.body, user: req.user._id });
  res.json(prayers);
});

// @desc    Set user prayer log by day
// @route   POST /api/dayPrayers/set
// @access  Private
// body {day, prayers}
export const setDayLogs = asyncHandler(async (req, res) => {
  const prayers = await DayPrayers.setDay({...req.body, user: req.user._id });
  res.json(prayers);
});

// @desc    get user prayer logs
// @route   GET /api/dayPrayers/day
// @access  Private
export const getDayLogs = asyncHandler(async (req, res) => {
  let query = {}
  if (req.query.day) {
    let start = new Date(req.query.day);
    start.setHours(0,0,0,0);

    let end = new Date(req.query.day);
    end.setHours(23,59,59,999);
    query.$and = [{day: {$lte: end }}, {day: {$gte: start}}]
  }
  query.user = req.user._id
  let fullQuery = {...req.query, ...query}
  delete fullQuery.day
  const prayers = await DayPrayers.findOne(fullQuery);
  res.json(prayers);
});
