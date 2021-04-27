import React, { useState, useEffect } from 'react';
import Swipe from './SwipeComponent';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
// import Loading from './Loader';
import day from 'dayjs';
import { updateUserPreferences } from '../redux/actions/userActions';
import { setLogs, getDayLogs } from '../redux/actions/prayerActions.js';
import { objectEmpty } from '../utils/utils';

const mapStateToProps = state => ({
  prayerTotals: state.prayerTotals,
  today: state.prayerLogs.today?.total || 0,
  userInfo: state.userInfo
});

const mapDispatchToProps = dispatch => ({
  setLogs: log => dispatch(setLogs(log)),
  getDayLogs: date => dispatch(getDayLogs(date)),
  updatePreferences: (prefs, user) =>
    dispatch(updateUserPreferences(prefs, user))
});

const Settings = props => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [period, setPeriod] = useState(4);
  const [isFemale, setIsFemale] = useState(false);
  const [dailyTarget, setDailyTarget] = useState(2);

  useEffect(() => {
    if (!objectEmpty(props.userInfo.user.preferences)) {
      setStart(new Date(props.userInfo.user.preferences.start));
      setEnd(new Date(props.userInfo.user.preferences.end));
      setPeriod(props.userInfo.user.preferences.period);
      setIsFemale(props.userInfo.user.preferences.isFemale);
      setDailyTarget(props.userInfo.user.preferences.dailyTarget || 2);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSaveSettings = e => {
    const startDate = day(start),
      endDate = day(end),
      periodLength = isFemale ? period : 0;
    // console.log(isFemale);
    const duration = day.duration(endDate.diff(startDate));
    const totalDays = Math.ceil(
      duration.asDays() - periodLength * duration.asMonths()
    );
    // console.log(duration.asDays)
    // console.log(duration.asMonths)
    const numberOfDays = isFemale ? totalDays : Math.ceil(duration.asDays());
    if (duration.asDays() === 0) {
      alert("Start date and End date can't be the same");
    } else {
      props.updatePreferences(
        {
          start,
          end,
          isFemale,
          days: numberOfDays,
          period: periodLength,
          dailyTarget,
          updatedAt: new Date()
        },
        props.user
      );
      props.hide();
    }
  };
  return (
    <>
      <h6 className='font-weight-bold mb-3 d-flex align-items-center'>
        Your Settings
      </h6>
      {!props.show ? (
        <div className='info mt-3'>
          <div>
            <small className='font-weight-bold'>Start Date</small>
            <p className='mb-2'>
              {day(props.userInfo?.user?.preferences.start).format(
                'DD/MM/YYYY'
              )}
            </p>
          </div>
          <div>
            <small className='font-weight-bold'>End Date</small>
            <p className='mb-2'>
              {day(props.userInfo?.user?.preferences.end).format('DD/MM/YYYY')}
            </p>
          </div>
          <div>
            <small className='font-weight-bold'>Total Prayers</small>
            <p className='mb-2'>
              {props.userInfo?.user?.preferences.days * 5} (
              {props.userInfo?.user?.preferences.days} days)
            </p>
          </div>
          <div>
            <small className='font-weight-bold'>Daily Target</small>
            <p className='mb-2'>{dailyTarget * 5} prayers</p>
          </div>
          {props.userInfo?.user?.preferences.isFemale && (
            <div>
              <small className='font-weight-bold'>Period Days</small>
              <p className='mb-2'>
                {props.userInfo?.user?.preferences.period || 4}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className='settings'>
          <Form.Group controlId='start'>
            <Form.Control
              required
              type='date'
              placeholder='Enter start'
              value={day(start).format('YYYY-MM-DD')}
              onChange={e => setStart(e.target.value)}
              className='small'></Form.Control>
            <Form.Label>Start Date</Form.Label>
          </Form.Group>
          <Form.Group controlId='end'>
            <Form.Control
              required
              type='date'
              placeholder='Enter end'
              value={day(end).format('YYYY-MM-DD')}
              onChange={e => setEnd(e.target.value)}
              className='small'></Form.Control>
            <Form.Label>End Date</Form.Label>
          </Form.Group>
          <Swipe
            small
            checkedText='Female'
            unCheckedText='Male'
            value={isFemale}
            onChange={v => setIsFemale(v)}
          />
          {isFemale && (
            <Form.Group controlId='period'>
              <Form.Control
                required
                type='number'
                min={2}
                max={15}
                placeholder='Enter period length'
                value={period}
                onChange={e => setPeriod(e.target.value)}
                className='small'></Form.Control>
              <Form.Label>Period Length</Form.Label>
            </Form.Group>
          )}

          <Form.Group controlId='dailyTarget'>
            <Form.Control
              required
              type='number'
              placeholder='Enter daily target'
              value={dailyTarget}
              onChange={e => setDailyTarget(e.target.value)}
              className='small'></Form.Control>
            <Form.Label>Daily Target (days)</Form.Label>
          </Form.Group>
          <Form.Group controlId='save' className='w-100'>
            <Button
              className='w-100'
              type='button'
              variant='primary'
              onClick={onSaveSettings}>
              Save
            </Button>
          </Form.Group>
          {!objectEmpty(props.userInfo.user.preferences) && (
            <Form.Group controlId='cancel' className='w-100'>
              <Button
                className='w-100 py-3'
                type='button'
                variant='link-secondary'
                onClick={() => props.hide()}>
                Cancel
              </Button>
            </Form.Group>
          )}
        </div>
      )}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
