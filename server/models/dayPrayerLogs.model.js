import mongoose from 'mongoose';
const { Schema } = mongoose;
import dayjs from 'dayjs';

import * as PRAYERS from '../constants.js';

const dayPrayerLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    day: { type: Date, default: Date.now },
    fajr: {
      type: Boolean,
      default: false
    },
    dhuhr: {
      type: Boolean,
      default: false
    },
    asr: {
      type: Boolean,
      default: false
    },
    maghrib: {
      type: Boolean,
      default: false
    },
    isha: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

dayPrayerLogSchema.statics.updateDay = function ({ user, day, prayer, done }) {
  day = dayjs(day).utc();
  return this.findOne({
    user,
    day: {
      $gte: dayjs(day).startOf('day'),
      $lte: dayjs(day).endOf('day')
    }
  }).then(dayLog => {
    if (dayLog) {
      // console.log(dayLog);
      // console.log(done);
      dayLog[prayer] = done;
      return dayLog.save();
    } else {
      return this.create({
        user,
        day: dayjs(day),
        [prayer]: done
      });
    }
  });
};

dayPrayerLogSchema.statics.updateDayPrayers = function ({
  user,
  day,
  prayers
}) {
  day = dayjs(day).utc();

  return this.findOne({
    user,
    day: {
      $gte: dayjs(day).startOf('day'),
      $lte: dayjs(day).endOf('day')
    }
  }).then(dayLog => {
    if (dayLog) {
      Object.keys(prayers).forEach(key => {
        dayLog[key] = prayers[key];
      });
      // dayLog[PRAYERS.FAJR] = prayers[PRAYERS.FAJR];
      // dayLog[PRAYERS.DHUHR] = prayers[PRAYERS.DHUHR];
      // dayLog[PRAYERS.ASR] = prayers[PRAYERS.ASR];
      // dayLog[PRAYERS.MAGHRIB] = prayers[PRAYERS.MAGHRIB];
      // dayLog[PRAYERS.ISHA] = prayers[PRAYERS.ISHA];
      return dayLog.save();
    } else {
      let newLog = { user, day: dayjs(day) };
      newLog[PRAYERS.FAJR] = prayers[PRAYERS.FAJR];
      newLog[PRAYERS.DHUHR] = prayers[PRAYERS.DHUHR];
      newLog[PRAYERS.ASR] = prayers[PRAYERS.ASR];
      newLog[PRAYERS.MAGHRIB] = prayers[PRAYERS.MAGHRIB];
      newLog[PRAYERS.ISHA] = prayers[PRAYERS.ISHA];
      return this.create(newLog);
    }
  });
};

dayPrayerLogSchema.statics.setDay = function ({ user, day, prayers }) {
  day = dayjs(day).utc();
  return this.findOne({
    user,
    day: {
      $gte: dayjs(day).startOf('day'),
      $lte: dayjs(day).endOf('day')
    }
  }).then(dayLog => {
    if (dayLog) {
      dayLog[PRAYERS.FAJR] = prayers[PRAYERS.FAJR];
      dayLog[PRAYERS.DHUHR] = prayers[PRAYERS.DHUHR];
      dayLog[PRAYERS.ASR] = prayers[PRAYERS.ASR];
      dayLog[PRAYERS.MAGHRIB] = prayers[PRAYERS.MAGHRIB];
      dayLog[PRAYERS.ISHA] = prayers[PRAYERS.ISHA];
      return dayLog.save();
    } else {
      let newLog = { user, day: dayjs(day) };
      newLog[PRAYERS.FAJR] = prayers[PRAYERS.FAJR];
      newLog[PRAYERS.DHUHR] = prayers[PRAYERS.DHUHR];
      newLog[PRAYERS.ASR] = prayers[PRAYERS.ASR];
      newLog[PRAYERS.MAGHRIB] = prayers[PRAYERS.MAGHRIB];
      newLog[PRAYERS.ISHA] = prayers[PRAYERS.ISHA];
      return this.create(newLog);
    }
  });
};
const PrayerLog = mongoose.model('DayPrayerLog', dayPrayerLogSchema);

export default PrayerLog;
