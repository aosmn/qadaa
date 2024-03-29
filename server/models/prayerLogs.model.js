import mongoose from 'mongoose';
const { Schema } = mongoose;
import dayjs from 'dayjs';

import * as PRAYERS from '../constants.js';

const prayerLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    day: { type: Date, default: Date.now },
    fajr: {
      type: Number,
      default: 0
    },
    dhuhr: {
      type: Number,
      default: 0
    },
    asr: {
      type: Number,
      default: 0
    },
    maghrib: {
      type: Number,
      default: 0
    },
    isha: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

prayerLogSchema.statics.updateDay = function ({ user, day, prayer, count }) {
  console.log(day);
  return this.findOne({
    user,
    day: {
      $gte: dayjs(day.day).subtract(day.tz, 'hours').startOf('day'),
      $lte: dayjs(day.day).subtract(day.tz, 'hours').endOf('day')
    }
  }).then(dayLog => {
    if (prayer === 'all') {
      if (dayLog) {
        dayLog[PRAYERS.FAJR] += count;
        dayLog[PRAYERS.DHUHR] += count;
        dayLog[PRAYERS.ASR] += count;
        dayLog[PRAYERS.MAGHRIB] += count;
        dayLog[PRAYERS.ISHA] += count;
        dayLog.total += count * 5;
        return dayLog.save();
      } else {
        let newLog = {
          user,
          day: dayjs(day.day).subtract(day.tz, 'hours'),
          total: count * 5
        };
        newLog[PRAYERS.FAJR] = count;
        newLog[PRAYERS.DHUHR] = count;
        newLog[PRAYERS.ASR] = count;
        newLog[PRAYERS.MAGHRIB] = count;
        newLog[PRAYERS.ISHA] = count;
        return this.create(newLog);
      }
    } else {
      if (dayLog) {
        dayLog[prayer] += count;
        dayLog.total += count;
        return dayLog.save();
      } else {
        return this.create({
          user,
          day: dayjs(day.day).subtract(day.tz, 'hours'),
          [prayer]: count,
          total: count
        });
      }
    }
  });
};

prayerLogSchema.statics.updateDayPrayers = function ({ user, day, prayers }) {
  return this.findOne({
    user,
    day: {
      $gte: dayjs(day.day).subtract(day.tz, 'hours').startOf('day'),
      $lte: dayjs(day.day).subtract(day.tz, 'hours').endOf('day')
    }
  }).then(dayLog => {
    const count =
      prayers[PRAYERS.FAJR] +
      prayers[PRAYERS.DHUHR] +
      prayers[PRAYERS.ASR] +
      prayers[PRAYERS.MAGHRIB] +
      prayers[PRAYERS.ISHA];
    if (dayLog) {
      dayLog[PRAYERS.FAJR] += prayers[PRAYERS.FAJR];
      dayLog[PRAYERS.DHUHR] += prayers[PRAYERS.DHUHR];
      dayLog[PRAYERS.ASR] += prayers[PRAYERS.ASR];
      dayLog[PRAYERS.MAGHRIB] += prayers[PRAYERS.MAGHRIB];
      dayLog[PRAYERS.ISHA] += prayers[PRAYERS.ISHA];
      dayLog.total += count;
      return dayLog.save();
    } else {
      let newLog = {
        user,
        day: dayjs(day.day).subtract(day.tz, 'hours'),
        total: count
      };
      newLog[PRAYERS.FAJR] = prayers[PRAYERS.FAJR];
      newLog[PRAYERS.DHUHR] = prayers[PRAYERS.DHUHR];
      newLog[PRAYERS.ASR] = prayers[PRAYERS.ASR];
      newLog[PRAYERS.MAGHRIB] = prayers[PRAYERS.MAGHRIB];
      newLog[PRAYERS.ISHA] = prayers[PRAYERS.ISHA];
      return this.create(newLog);
    }
  });
};

prayerLogSchema.statics.setDay = function ({ user, day, prayers }) {
  console.log(day);
  return this.findOne({
    user,
    day: {
      $gte: dayjs(day.day).subtract(day.tz, 'hours').startOf('day'),
      $lte: dayjs(day.day).subtract(day.tz, 'hours').endOf('day')
    }
  })
    .then(dayLog => {
      if (dayLog) {
        dayLog[PRAYERS.FAJR] = prayers[PRAYERS.FAJR];
        dayLog[PRAYERS.DHUHR] = prayers[PRAYERS.DHUHR];
        dayLog[PRAYERS.ASR] = prayers[PRAYERS.ASR];
        dayLog[PRAYERS.MAGHRIB] = prayers[PRAYERS.MAGHRIB];
        dayLog[PRAYERS.ISHA] = prayers[PRAYERS.ISHA];
        dayLog.total =
          prayers[PRAYERS.FAJR] +
          prayers[PRAYERS.DHUHR] +
          prayers[PRAYERS.ASR] +
          prayers[PRAYERS.MAGHRIB] +
          prayers[PRAYERS.ISHA];
        return dayLog.save();
      } else {
        let newLog = { user, day: dayjs(day.day).subtract(day.tz, 'hours') };
        newLog[PRAYERS.FAJR] = prayers[PRAYERS.FAJR];
        newLog[PRAYERS.DHUHR] = prayers[PRAYERS.DHUHR];
        newLog[PRAYERS.ASR] = prayers[PRAYERS.ASR];
        newLog[PRAYERS.MAGHRIB] = prayers[PRAYERS.MAGHRIB];
        newLog[PRAYERS.ISHA] = prayers[PRAYERS.ISHA];
        newLog.total =
          prayers[PRAYERS.FAJR] +
          prayers[PRAYERS.DHUHR] +
          prayers[PRAYERS.ASR] +
          prayers[PRAYERS.MAGHRIB] +
          prayers[PRAYERS.ISHA];
        return this.create(newLog);
      }
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};
const PrayerLog = mongoose.model('PrayerLog', prayerLogSchema);

export default PrayerLog;
