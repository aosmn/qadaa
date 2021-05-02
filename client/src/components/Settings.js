import React, { useState, useEffect } from 'react';
import Swipe from './SwipeComponent';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import day from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { updateUserPreferences } from '../redux/actions/userActions';
import { setLogs, getDayLogs } from '../redux/actions/prayerActions.js';
import { objectEmpty } from '../utils/utils';
import { useForm } from 'react-hook-form';
day.extend(duration);

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
  const [isFemale, setIsFemale] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm();

  useEffect(() => {
    if (!objectEmpty(props.userInfo.user.preferences)) {
      reset({
        start: props.userInfo.user.preferences.start
          ? new Date(props.userInfo.user.preferences.start)
          : new Date(),
        end: props.userInfo.user.preferences.end
          ? new Date(props.userInfo.user.preferences.end)
          : new Date(),
        period: props.userInfo.user.preferences.period || 0,
        dailyTarget: props.userInfo.user.preferences.dailyTarget || 2
      });
      setIsFemale(props.userInfo.user.preferences.isFemale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = e => {
    e.preventDefault();
    handleSubmit(onSaveSettings)();
  };

  const onSaveSettings = data => {
    const startDate = day(data.start),
      endDate = day(data.end),
      periodLength = isFemale ? data.period : 0;
    const duration = day.duration(endDate.diff(startDate));
    const totalDays = Math.ceil(
      duration.asDays() - periodLength * duration.asMonths()
    );
    const numberOfDays = isFemale ? totalDays : Math.ceil(duration.asDays());
    if (duration.asDays() === 0) {
      alert("Start date and End date can't be the same");
    } else {
      props.updatePreferences(
        {
          start: data.start,
          end: data.end,
          isFemale,
          days: numberOfDays,
          period: periodLength,
          dailyTarget: data.dailyTarget || 0,
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
            <p className='mb-2'>{(props.userInfo?.user?.preferences.dailyTarget || 0) * 5} prayers</p>
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
          <Form.Group controlId='start' className='mb-4'>
            <Form.Control
              {...register('start', {
                required: 'Start date required',
                validate: val => {
                  return (
                    day(val).isBefore(day(getValues().end)) ||
                    'Start Date should be before End Date'
                  );
                }
              })}
              type='date'
              className='small'
              isInvalid={errors.start}
            />
            <Form.Label>Start Date</Form.Label>
            <Form.Control.Feedback type='invalid'>
              {errors.start && errors.start.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId='end' className='mb-4'>
            <Form.Control
              {...register('end', {
                required: 'End date required',
                validate: val => {
                  return (
                    day(val).isAfter(day(getValues().start)) ||
                    'Start Date should be before End Date'
                  );
                }
              })}
              type='date'
              className='small'
              isInvalid={errors.end}
            />
            <Form.Label>End Date</Form.Label>
            <Form.Control.Feedback type='invalid'>
              {errors.end && errors.end.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Swipe
            small
            checkedText='Female'
            unCheckedText='Male'
            value={isFemale}
            onChange={v => setIsFemale(v)}
          />
          {isFemale && (
            <Form.Group controlId='period' className='mb-4'>
              <Form.Control
                {...register('period', {
                  required: 'Period length required',
                  validate: val => {
                    return (
                      (val < 16 && val > 3) ||
                      'Period length must be between 3 and 15'
                    );
                  }
                })}
                type='number'
                min={3}
                max={15}
                className='small'
                isInvalid={errors.period}></Form.Control>
              <Form.Label>Period Length</Form.Label>
              <Form.Control.Feedback type='invalid'>
                {errors.period && errors.period.message}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          <Form.Group controlId='dailyTarget' className='mb-4'>
            <Form.Control
              {...register('dailyTarget')}
              type='number'
              className='small'></Form.Control>
            <Form.Label>Daily Target (days)</Form.Label>
          </Form.Group>
          <Form.Group controlId='save' className='w-100'>
            <Button
              className='w-100'
              type='button'
              variant='primary'
              onClick={submitHandler}>
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