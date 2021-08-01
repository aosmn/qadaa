import React, { useEffect, useState } from 'react';
import axios from 'axios';
import day from 'dayjs';
import 'dayjs/locale/ar';
// import Method from '../components/CalculationMethod';
import { Button, Col, Row } from 'react-bootstrap';
import {
  getLogs,
  updateDayLogs,
  getDayLogs
} from '../redux/actions/haderPrayerActions.js';
import { LoadingOverlay } from '..//components/Loader';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getPrayerTimes } from '../api/prayerTimes.api';

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  haderPrayers: state.haderPrayerLogs,
  haderPrayersDay: state.haderPrayerLogs.day
});

const mapDispatchToProps = dispatch => ({
  getLogs: id => dispatch(getLogs(id)),
  updateDayLogs: log => dispatch(updateDayLogs(log)),
  getTodayLogs: () => dispatch(getDayLogs()),
  getDayLogs: day => dispatch(getDayLogs(day))
});

const isBetween = require('dayjs/plugin/isBetween');
day.extend(isBetween);

const PrayerTimes = props => {
  const { t, i18n } = useTranslation(['home']);
  const [prayerTimes, setPrayerTimes] = useState([]);
  const prayers = Object.keys(prayerTimes);
  // console.log(props);
  const prayertimes = prayers.map((key, index) => {
    const prayerStatus = false;
    const isDone = props.prayers?.[key.toLowerCase()];
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
        date={props.selectedDate}
      />
    );
  });
  useEffect(() => {
    // console.log(props.selectedDate);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        getPrayerTimes(
          position.coords.latitude,
          position.coords.longitude,
          localStorage.getItem('calculationMethod'),
          props.selectedDate
        ).then(res => setPrayerTimes(res.prayerTimes));
        // axios
        //   .get(
        //     `http://api.aladhan.com/v1/timings/${day(
        //       props.selectedDate
        //     ).unix()}?latitude=${position.coords.latitude}&longitude=${
        //       position.coords.longitude
        //     }&method=${localStorage.getItem('calculationMethod') || 0}`
        //   )
        //   .then(res => setPrayerTimes(res.data.data.timings));
      });
      console.log('Available');
    } else {
      console.log('Not Available');
    }
  }, [props.selectedDate]);
  useEffect(() => {
    // getLogs
    props.getDayLogs(props.selectedDate);
  }, [props.userInfo.user._id]);

  return (
    <div className='w-100'>
      <h6>
        <b>
          {day(props.prayers.day)
            .locale(i18n.language)
            .format('ddd DD-MM-YYYY')}
        </b>
      </h6>
      <h6>
        <small>{t('haderLogs')}</small>
      </h6>
      {props.haderPrayers.loadingDay ||
        (props.haderPrayers.updateLoading && <LoadingOverlay />)}
      <div className='prayer-times mt-4'>{prayertimes}</div>
      <Row className='justify-content-end'>
        <Col sm={6}>
          <Button
            type='button'
            variant='light'
            title='cancel'
            className='w-100 align-items-center py-3 mt-3 btn-slim'
            onClick={() => {
              props.onCancel();
            }}>
            {t('cancel')}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PrayerTimes);

const PrayerItem = ({ prayer, onCheck, isDone, date }) => {
  const { t } = useTranslation(['home']);
  const [done, setDone] = useState(isDone);
  const onChange = e => {
    // console.log('henaaaa');
    // console.log(date);
    onCheck({
      day: date,
      prayer: prayer.id.toLowerCase(),
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
            id={`checkbox-${prayer.id}${date}`}
            onChange={onChange}
            checked={done}
          />
          <label
            className='custom-control-label'
            htmlFor={`checkbox-${prayer.id}${date}`}>
            <div className='prayer-name'>{t(prayer.id)}</div>
          </label>
        </div>
        <div className='prayer-time'>{prayer.time}</div>
      </div>
    );
};
