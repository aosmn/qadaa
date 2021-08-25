import Fatwa from '../models/fatwa.model.js';
import asyncHandler from 'express-async-handler';

// @desc    post fatwa
// @route   POST /fatwas
// @access  private
export const postFatwa = asyncHandler(async (req, res) => {
  const fatwa = await Fatwa.create(req.body);
  res.json(fatwa);
});

// @desc    get all fatwas
// @route   GET /fatwas
// @access  public
export const getFatwas = asyncHandler(async (req, res) => {
  const fatwas = await Fatwa.find(req.query);
  res.json(fatwas);
});
