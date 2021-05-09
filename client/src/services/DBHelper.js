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

      // eslint-disable-next-line no-fallthrough
      default:
    }
  }
});

export const getOfflineDayLogs = () => {
  let allLogs = [];
  return dbPromise
    .then(async db => {
      const index = db.transaction('day-logs').store.index('day');
      for await (const cursor of index.iterate(null, 'prev')) {
        allLogs.push(cursor.value);
      }
      return allLogs;
    })
    .catch(error => {
      throw error;
    });
};

// export const clearOfflineLogs = () => {
//   return dbPromise
//     .then(async db => {
//       const store = db.transaction('day-logs', 'readwrite').store;
//       return store.clear('day-logs');
//     })
//     .catch(error => {
//       throw error;
//     });
//   // .clear('keyval')
// };

export const deleteDayLogs = () => {
  return dbPromise
    .then(async db => {
      const index = db.transaction('day-logs', 'readwrite').store.clear();
      return index;
    })
    .catch(error => {
      throw error;
    });
};

export const deleteDayLogsByDay = (id) => {
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

export const getTodayLogs = () => {
  // let allLogs = [];
  return dbPromise
    .then(async db => {
      const index = db.transaction('day-logs').store.index('day');
      return index.get(day().format('MM/DD/YYYY'));
    })
    .catch(error => {
      throw error;
    });
};

export const logPrayersOffline = ({ prayer, count, date }) => {
  // console.log(day(date).startOf('day').$d);
  updateDay(day(date).format('MM/DD/YYYY'), prayer, count);
};

export const updateDay = (date, prayer, count) => {
  return dbPromise
    .then(async db => {
      const index = db.transaction('day-logs').store.index('day');
      index.get(day(date).format('MM/DD/YYYY')).then(d => {
        const tx = db.transaction('day-logs', 'readwrite');
        if (prayer === 'all') {
          updateTotalCount(count * 5);
          if (!d) {
            tx.store
              .add({
                id: uuidv4(),
                fajr: count,
                dhuhr: count,
                asr: count,
                maghrib: count,
                isha: count,
                day: day().format('MM/DD/YYYY')
              })
              .then(id => tx.done);
          } else {
            d['fajr'] = (d['fajr'] || 0) + count;
            d['dhuhr'] = (d['dhuhr'] || 0) + count;
            d['asr'] = (d['asr'] || 0) + count;
            d['maghrib'] = (d['maghrib'] || 0) + count;
            d['isha'] = (d['isha'] || 0) + count;
            tx.store.put(d).then(id => tx.done);
          }
        } else {
          updateTotalCount(count);
          if (!d) {
            tx.store
              .add({
                id: uuidv4(),
                [prayer]: count,
                day: day().format('MM/DD/YYYY')
              })
              .then(id => tx.done);
          } else {
            let newCount = (d[prayer] || 0) + count;
            d[prayer] = newCount;
            tx.store.put(d).then(id => tx.done);
          }
        }
      });
    })
    .catch(error => {
      throw error;
    });

  // return dbPromise.then(db => {
  //   const tx = db.transaction('prayer-logs', 'readwrite');
  //   return tx.store.add({
  //     id: uuidv4(),
  //     prayer,
  //     count: -1*count,
  //     createdAt: createdAt || new Date(),
  //     day: moment().startOf('day')._d
  //   }).then((id)=>
  //     tx.done.then(r =>
  //       ({
  //         id,
  //         prayer,
  //         count: -1*count,
  //         createdAt: createdAt || new Date(),
  //         day: moment().startOf('day')._d
  //       })
  //     )
  //   );
  // });
};

export const getPrayerCount = prayer => {
  let count = 0;

  return dbPromise
    .then(async db => {
      const index = db.transaction('day-logs').store;
      for await (const cursor of index.iterate('')) {
        // count += parseInt(cursor.value.count);
        console.log(cursor.value);
      }
      // console.log(count);
      return count;
    })
    .catch(error => {
      throw error;
    });
};

export const getOfflineTotals = prayer => {
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
      const index = db.transaction('day-logs').store;
      for await (const cursor of index) {
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

  // return getPrayerCount(PRAYERS.FAJR)
  //   .then(total => {
  //     if (total) totals[PRAYERS.FAJR] += parseInt(total, 10);
  //     return getPrayerCount(PRAYERS.DHUHR);
  //   })
  //   .then(total => {
  //     if (total) totals[PRAYERS.DHUHR] += parseInt(total, 10);
  //     return getPrayerCount(PRAYERS.ASR);
  //   })
  //   .then(total => {
  //     if (total) totals[PRAYERS.ASR] += parseInt(total, 10);
  //     return getPrayerCount(PRAYERS.MAGHRIB);
  //   })
  //   .then(total => {
  //     if (total) totals[PRAYERS.MAGHRIB] += parseInt(total, 10);
  //     return getPrayerCount(PRAYERS.ISHA);
  //   })
  //   .then(total => {
  //     if (total) totals[PRAYERS.ISHA] += parseInt(total, 10);
  //     console.log('totals', totals);
  //     return totals
  //   });
};

export const updateTotalCount = count => {
  let totalPrayers = window.localStorage.getItem('total-offline');
  if (totalPrayers) {
    totalPrayers = parseInt(totalPrayers, 10);
    totalPrayers += count;
    window.localStorage.setItem('total-offline', totalPrayers);
  } else {
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    totalPrayers = 0;
    getPrayerCount(prayers[0])
      .then(total => {
        if (total) totalPrayers += parseInt(total, 10);
        return getPrayerCount(prayers[1]);
      })
      .then(total => {
        if (total) totalPrayers += parseInt(total, 10);
        return getPrayerCount(prayers[2]);
      })
      .then(total => {
        if (total) totalPrayers += parseInt(total, 10);
        return getPrayerCount(prayers[3]);
      })
      .then(total => {
        if (total) totalPrayers += parseInt(total, 10);
        return getPrayerCount(prayers[4]);
      })
      .then(total => {
        if (total) totalPrayers += parseInt(total, 10);

        totalPrayers += count;
        // console.log(totalPrayers);
        window.localStorage.setItem('total-offline', totalPrayers);
      });
  }
};
