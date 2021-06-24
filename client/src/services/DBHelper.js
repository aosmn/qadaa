import { openDB } from 'idb/with-async-ittr.js';
import { v4 as uuidv4 } from 'uuid';
import day from 'dayjs';
import * as PRAYERS from '../utils/constants';

const prayers = [
  PRAYERS.FAJR,
  PRAYERS.DHUHR,
  PRAYERS.ASR,
  PRAYERS.MAGHRIB,
  PRAYERS.ISHA
];

const dbPromise = openDB('Qadaa', 5, {
  upgrade(db, oldVersion, newVersion, transaction) {
    // console.log(oldVersion);
    switch (oldVersion) {
      case 0:
      case 1:
        // Create a store of objects
        const dayStore = db.createObjectStore('day-logs', {
          keyPath: 'id'
        });
        dayStore.createIndex('day', 'day');
        dayStore.createIndex('user', 'user');
        dayStore.createIndex('user-day', ['user', 'day']);
        dayStore.createIndex('user-prayer', ['user', 'prayer']);

      // eslint-disable-next-line no-fallthrough
      default:
    }
  }
});

export const getOfflineDayLogs = user => {
  let allLogs = [];
  if (user) {
    return dbPromise
      .then(async db => {
        const index = db.transaction('day-logs').store.index('user');
        for await (const cursor of index.iterate(user, 'prev')) {
          allLogs.push(cursor.value);
        }
        return allLogs;
      })
      .catch(error => {
        throw error;
      });
  }
};

// export const deleteDayLogs = (user) => {
//   return dbPromise
//     .then(async db => {
//       const index = db.transaction('day-logs', 'readwrite').store.clear();
//       return index;
//     })
//     .catch(error => {
//       throw error;
//     });
// };

export const deleteDayLogsByDay = id => {
  return dbPromise
    .then(async db => {
      // const index = db.transaction('day-logs').store.index('day');
      const index = db.transaction('day-logs', 'readwrite').store;
      console.log(id);
      return index.delete(id);
    })
    .catch(error => {
      throw error;
    });
};

// export const getTodayLogs = () => {
//   // let allLogs = [];
//   return dbPromise
//     .then(async db => {
//       const index = db.transaction('day-logs').store.index('day');
//       return index.get(day().format('MM/DD/YYYY'));
//     })
//     .catch(error => {
//       throw error;
//     });
// };

export const logPrayersOffline = ({ prayer, count, date, user }) => {
  // console.log(day(date).startOf('day').$d);
  updateDay(day(date).format('MM/DD/YYYY'), prayer, count, user);
};

export const updateDay = (date, prayer, count, user) => {
  return dbPromise
    .then(async db => {
      const index = db.transaction('day-logs').store.index('user-day');
      index.get([user, day(date).format('MM/DD/YYYY')]).then(d => {
        const tx = db.transaction('day-logs', 'readwrite');
        if (prayer === 'all') {
          if (!d) {
            tx.store
              .add({
                id: uuidv4(),
                user,
                fajr: count,
                dhuhr: count,
                asr: count,
                maghrib: count,
                isha: count,
                day: day().format('MM/DD/YYYY')
              })
              .then(id => {
                updateTotalCount(count * 5, user);
                return tx.done;
              });
          } else {
            d['fajr'] = (d['fajr'] || 0) + count;
            d['dhuhr'] = (d['dhuhr'] || 0) + count;
            d['asr'] = (d['asr'] || 0) + count;
            d['maghrib'] = (d['maghrib'] || 0) + count;
            d['isha'] = (d['isha'] || 0) + count;
            tx.store.put(d).then(id => {
              updateTotalCount(count * 5, user);
              return tx.done;
            });
          }
        } else {
          if (!d) {
            tx.store
              .add({
                id: uuidv4(),
                user,
                [prayer]: count,
                day: day().format('MM/DD/YYYY')
              })
              .then(id => {
                updateTotalCount(count, user);
                return tx.done;
              });
          } else {
            let newCount = (d[prayer] || 0) + count;
            d[prayer] = newCount;
            tx.store.put(d).then(id => {
              updateTotalCount(count, user);
              return tx.done;
            });
          }
        }
      });
    })
    .catch(error => {
      throw error;
    });
};
// add user index
export const getOfflineTotals = (user, prayer) => {
  let totals = {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
    total: 0
  };
  return dbPromise
    .then(async db => {
      const index = db.transaction('day-logs').store.index('user');
      // const index = db.transaction('day-logs').store;
      for await (const cursor of index.iterate(user)) {
        let smallTotal = 0;
        prayers.forEach(prayer => {
          const prayerCount = cursor.value[prayer]
            ? parseInt(cursor.value[prayer], 10)
            : 0;
          // console.log(cursor.value);
          smallTotal += prayerCount;
          totals[prayer] += prayerCount;
        });
        totals.total += smallTotal;
      }
      // console.log(totals);
      return totals;
    })
    .catch(error => {
      throw error;
    });
};

export const updateTotalCount = (count, user) => {
  let totalPrayers = window.localStorage.getItem('total-offline');
  if (totalPrayers) {
    totalPrayers = parseInt(totalPrayers, 10);
    totalPrayers += count;
    window.localStorage.setItem('total-offline', totalPrayers);
  } else {
    // const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    totalPrayers = 0;
    getOfflineTotals(user).then(totals => {
      if (totals.total) totalPrayers = totals.total;
      window.localStorage.setItem('total-offline', totalPrayers);
    });
  }
};
