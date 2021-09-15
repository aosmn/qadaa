import React, { useEffect, useState } from 'react';
import day from 'dayjs';
import Method from '../components/CalculationMethod';
import { Button } from 'react-bootstrap';
import {
  getLogs,
  updateDayLogs,
  getDayLogs
} from '../redux/actions/haderPrayerActions.js';
import { LoadingOverlay } from '../components/Loader';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getPrayerTimes } from '../api/prayerTimes.api';
import useForceUpdate from '../utils/useForceUpdate';

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  haderPrayers: state.haderPrayerLogs,
  haderPrayersToday: state.haderPrayerLogs.today
});

const mapDispatchToProps = dispatch => ({
  getLogs: id => dispatch(getLogs(id)),
  updateDayLogs: log => dispatch(updateDayLogs(log)),
  getTodayLogs: () => dispatch(getDayLogs())
});

const isBetween = require('dayjs/plugin/isBetween');
day.extend(isBetween);

const PrayerTimes = props => {
  const { t } = useTranslation(['home']);
  const forceUpdate = useForceUpdate();
  const [showSettings, setShowSettings] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: 0,
    Dhuhr: 0,
    Asr: 0,
    Maghrib: 0,
    Isha: 0
  });
  const [loadingPrayerTimes, setLoadingPrayerTimes] = useState(false);
  const isCurrentTime = (prayerTime, nextPrayer, index) => {
    if (!!prayerTime && !!nextPrayer) {
      const prayer = day()
        .hour(prayerTime.split(':')[0])
        .minute(prayerTime.split(':')[1]);
      const next = day()
        .hour(nextPrayer.split(':')[0])
        .minute(nextPrayer.split(':')[1]);
      if (index === 6) {
        return day().isAfter(prayer) ? 'current' : 'upcoming';
      }
      return day().isBetween(prayer, next)
        ? 'current'
        : day().isAfter(prayer)
        ? 'previous'
        : 'upcoming';
    }
  };
  const prayers = Object.keys(prayerTimes);
  const prayertimes = prayers.map((key, index) => {
    const prayerStatus = isCurrentTime(
      prayerTimes[key],
      prayerTimes[prayers[index + 1]],
      index
    );
    const isDone = props.haderPrayersToday?.[key.toLowerCase()];
    return (
      <PrayerItem
        key={key}
        prayer={{
          id: key.toLowerCase(),
          time: prayerTimes[key],
          status: prayerStatus
        }}
        onCheck={props.updateDayLogs}
        isDone={isDone}
      />
    );
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLoadingPrayerTimes(true);
        getPrayerTimes(
          position.coords.latitude,
          position.coords.longitude,
          localStorage.getItem('calculationMethod')
        ).then(res => {
          setPrayerTimes(res.prayerTimes);
          setLoadingPrayerTimes(false);
        });
      });
      // console.log('Available');
    } else {
      // console.log('Not Available');
    }
  }, []);
  useEffect(() => {
    props.getTodayLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userInfo.user._id]);

  useEffect(() => {
    let inter = setInterval(() => {
      forceUpdate()
    }, 60 * 1000);
    return () => {
      clearInterval(inter);
    };
  }, []);
  const updateLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLoadingPrayerTimes(true);
        getPrayerTimes(
          position.coords.latitude,
          position.coords.longitude,
          localStorage.getItem('calculationMethod')
        ).then(res => {
          setPrayerTimes(res.prayerTimes);
          setLoadingPrayerTimes(false);
        });
      });
      console.log('Available');
    } else {
      console.log('Not Available');
    }
  };

  return (
    <div className='w-100'>
      <h6 className='d-flex justify-content-between'>
        {t('prayerTimes')}
        <div>
          <Button
            title='update location'
            variant='link'
            className='btn text-dark p-0 mx-2'
            onClick={() => {
              updateLocation();
            }}>
            <ion-icon name='location-outline'></ion-icon>
          </Button>
          <Button
            variant='link'
            className='btn text-dark p-0'
            onClick={() => {
              setShowSettings(!showSettings);
            }}>
            {showSettings ? (
              <ion-icon name='close'></ion-icon>
            ) : (
              <ion-icon name='settings-outline'></ion-icon>
            )}
          </Button>
        </div>
      </h6>
      {showSettings ? (
        <Method onSubmit={() => setShowSettings(false)} />
      ) : (
        <>
          {(loadingPrayerTimes ||
            props.haderPrayers.loadingToday ||
            props.haderPrayers.updateLoading) && <LoadingOverlay />}
          <div className='prayer-times'>{prayertimes}</div>
        </>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PrayerTimes);

const PrayerItem = ({ prayer, onCheck, isDone }) => {
  const [done, setDone] = useState(isDone);
  const { t } = useTranslation(['home']);

  const onChange = e => {
    // console.log(e.target.checked);
    onCheck({
      day: new Date(),
      prayer: prayer.id,
      done: e.target.checked
    });
    setDone(e.target.checked);
  };
  useEffect(() => {
    setDone(isDone);
  }, [isDone]);
  if (
    prayer.id === 'sunset' ||
    prayer.id === 'midnight' ||
    prayer.id === 'imsak' ||
    prayer.id === 'sunrise'
  ) {
    return null;
  } else
    return (
      <div
        key={prayer.id}
        className={`prayer-time-item d-flex flex-row w-100 ${prayer.status}`}>
        <div className='custom-control custom-checkbox d-flex align-items-center'>
          <input
            type='checkbox'
            className='custom-control-input'
            id={`checkbox-${prayer.id}`}
            onChange={onChange}
            checked={done}
          />
          <label
            className='custom-control-label'
            htmlFor={`checkbox-${prayer.id}`}>
            <div className='prayer-name'>{t(prayer.id)}</div>
          </label>
        </div>
        <div className='prayer-time'>{prayer.time !== 0 && prayer.time}</div>
      </div>
    );
};
