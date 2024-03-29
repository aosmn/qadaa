import React, { useState, useEffect } from 'react';
import Swipe from './SwipeComponent';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import day from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { updateUserPreferences } from '../redux/actions/userActions';
import { setLogs, getDayLogs } from '../redux/actions/prayerActions.js';
import { objectEmpty } from '../utils/utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
day.extend(duration);

const mapStateToProps = state => ({
  prayerTotals: state.prayerTotals,
  today: state.prayerLogs.today?.total || 0,
  userInfo: state.userInfo,
  joyride: state.joyride
});

const mapDispatchToProps = dispatch => ({
  setLogs: log => dispatch(setLogs(log)),
  getDayLogs: date => dispatch(getDayLogs(date)),
  updatePreferences: (prefs, user) =>
    dispatch(updateUserPreferences(prefs, user))
});

const Settings = props => {
  const { t } = useTranslation(['home']);
  const [isFemale, setIsFemale] = useState(false);
  const [enterManually, setEnterManually] = useState(false);
  const [trackHader, setTrackHader] = useState(
    props.userInfo?.user?.preferences?.trackHader
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm();

  useEffect(() => {
    if (!objectEmpty(props.userInfo.user?.preferences)) {
      reset({
        start: props.userInfo.user.preferences.start
          ? day(props.userInfo.user.preferences.start).format('YYYY-MM-DD')
          : day().format('YYYY-MM-DD'),
        end: props.userInfo.user.preferences.end
          ? day(props.userInfo.user.preferences.end).format('YYYY-MM-DD')
          : day().format('YYYY-MM-DD'),
        period: props.userInfo.user.preferences.period || 0,
        dailyTarget: props.userInfo.user.preferences.dailyTarget || 2
      });
      setIsFemale(props.userInfo.user.preferences.isFemale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (enterManually) {
      reset({
        days: props.userInfo?.user?.preferences?.days || 1,
        dailyTarget: props.userInfo?.user?.preferences?.dailyTarget || 2
        // trackHader: props.userInfo?.user?.preferences?.trackHader
      });
    } else {
      if (!objectEmpty(props.userInfo.user.preferences)) {
        reset({
          start: props.userInfo.user.preferences.start
            ? day(props.userInfo.user.preferences.start).format('YYYY-MM-DD')
            : day().format('YYYY-MM-DD'),
          end: props.userInfo.user.preferences.end
            ? day(props.userInfo.user.preferences.end).format('YYYY-MM-DD')
            : day().format('YYYY-MM-DD'),
          period: props.userInfo.user.preferences.period || 0,
          dailyTarget: props.userInfo.user.preferences.dailyTarget || 2
        });
        setIsFemale(props.userInfo.user.preferences.isFemale);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterManually]);
  const submitHandler = e => {
    e.preventDefault();
    handleSubmit(onSaveSettings)();
  };

  const onSaveSettings = data => {
    // console.log(trackHader);
    if (enterManually) {
      props
        .updatePreferences(
          {
            start: day().subtract(data.days, 'days'),
            end: day(),
            isFemale,
            days: data.days,
            dailyTarget: data.dailyTarget || 0,
            updatedAt: new Date(),
            trackHader
          },
          props.user
        )
        .then(() => {
          props.joyride.next && props.joyride.next();
        });
      props.hide();
    } else {
      const startDate = day(data.start),
        endDate = day(data.end),
        periodLength = isFemale ? data.period : 0;
      const duration = day.duration(endDate.diff(startDate));
      const totalDays = Math.ceil(
        duration.asDays() - periodLength * duration.asMonths()
      );
      const numberOfDays = isFemale ? totalDays : Math.ceil(duration.asDays());
      if (duration.asDays() === 0) {
        alert(t('inputFields.durationError'));
      } else {
        props
          .updatePreferences(
            {
              start: data.start,
              end: data.end,
              isFemale,
              days: numberOfDays,
              period: periodLength,
              dailyTarget: data.dailyTarget || 0,
              updatedAt: new Date(),
              trackHader
            },
            props.user
          )
          .then(() => {
            props.joyride.next && props.joyride.next();
          });
        props.hide();
      }
    }
  };
  return (
    <>
      <h6 className='font-weight-bold mb-3 d-flex align-items-center'>
        {t('yourSettings')}
      </h6>
      {!props.show ? (
        <div className='info mt-3'>
          <div>
            <small className='font-weight-bold'>
              <strong>{t('inputFields.start.label')}</strong>
            </small>
            <p className='mb-2'>
              {day(props.userInfo?.user?.preferences.start).format(
                'DD/MM/YYYY'
              )}
            </p>
          </div>
          <div>
            <small className='font-weight-bold'>
              <strong>{t('inputFields.end.label')}</strong>
            </small>
            <p className='mb-2'>
              {day(props.userInfo?.user?.preferences.end).format('DD/MM/YYYY')}
            </p>
          </div>
          <div>
            <small className='font-weight-bold'>
              <strong>{t('inputFields.numberOfDays.label')}</strong>
            </small>
            <p className='mb-2'>
              {props.userInfo?.user?.preferences.days * 5} (
              {props.userInfo?.user?.preferences.days} {t('days')})
            </p>
          </div>
          <div>
            <small className='font-weight-bold'>
              <strong>{t('inputFields.dailyTarget.label')}</strong>
            </small>
            <p className='mb-2'>
              {(props.userInfo?.user?.preferences.dailyTarget || 0) * 5}{' '}
              {t('prayers')}
            </p>
          </div>
          {props.userInfo?.user?.preferences.isFemale && (
            <div>
              <small className='font-weight-bold'>
                <strong>{t('inputFields.periodDays.label')}</strong>
              </small>
              <p className='mb-2'>
                {props.userInfo?.user?.preferences.period || 4}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className='settings'>
          <Form.Group controlId='trackHader'>
            <Form.Check
              inline
              label={t('logHader')}
              name='trackHader'
              type='checkbox'
              id='trackHader'
              onChange={e => setTrackHader(e.target.checked)}
              checked={trackHader}
            />
          </Form.Group>
          <hr />
          <Form.Group controlId='set-manually' className='mb-3'>
            <Form.Check
              inline
              label={t('enterManually')}
              name='enterManual'
              type='checkbox'
              id='enterManual'
              onChange={e => setEnterManually(e.target.checked)}
              checked={enterManually}
            />
          </Form.Group>
          {enterManually ? (
            <FloatingLabel
              className='mb-4 small'
              controlId='days'
              label={t('inputFields.numberOfDays.label')}>
              <Form.Control
                {...register('days', {
                  required: t('inputFields.numberOfDays.required'),
                  validate: val => {
                    return val > 1 || t('inputFields.numberOfDays.invalid');
                  }
                })}
                min={1}
                type='number'
                className='small days'
                isInvalid={errors.days}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.numberOfDays && errors.numberOfDays.message}
              </Form.Control.Feedback>
            </FloatingLabel>
          ) : (
            // <Form.Group controlId='days' className='mb-4'>
            //   <Form.Control
            //     {...register('days', {
            //       required: t('inputFields.numberOfDays.required'),
            //       validate: val => {
            //         return val > 1 || t('inputFields.numberOfDays.invalid');
            //       }
            //     })}
            //     min={1}
            //     type='number'
            //     className='small days'
            //     isInvalid={errors.days}
            //   />
            //   <Form.Label>{t('inputFields.numberOfDays.label')}</Form.Label>
            //   <Form.Control.Feedback type='invalid'>
            //     {errors.days && errors.days.message}
            //   </Form.Control.Feedback>
            // </Form.Group>
            <>
              <FloatingLabel
                className='mb-4 small'
                controlId='start'
                label={t('inputFields.start.label')}>
                <Form.Control
                  {...register('start', {
                    required: t('inputFields.start.required'),
                    validate: val => {
                      return (
                        day(val).isBefore(day(getValues().end)) ||
                        t('inputFields.start.invalid')
                      );
                    }
                  })}
                  type='date'
                  className='small startDate'
                  isInvalid={errors.start}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.start && errors.start.message}
                </Form.Control.Feedback>
              </FloatingLabel>
              {/* <Form.Group controlId='start' className='mb-4'>
                <Form.Control
                  {...register('start', {
                    required: t('inputFields.start.required'),
                    validate: val => {
                      return (
                        day(val).isBefore(day(getValues().end)) ||
                        t('inputFields.start.invalid')
                      );
                    }
                  })}
                  // defaultValue={new Date(props.userInfo.user.preferences.start)}
                  type='date'
                  className='small startDate'
                  isInvalid={errors.start}
                />
                <Form.Label>{t('inputFields.start.label')}</Form.Label>
                <Form.Control.Feedback type='invalid'>
                  {errors.start && errors.start.message}
                </Form.Control.Feedback>
              </Form.Group> */}

              <FloatingLabel
                className='mb-4 small'
                controlId='end'
                label={t('inputFields.end.label')}>
                <Form.Control
                  {...register('end', {
                    required: t('inputFields.end.required'),
                    validate: val => {
                      return (
                        day(val).isAfter(day(getValues().start)) ||
                        t('inputFields.end.invalid')
                      );
                    }
                  })}
                  type='date'
                  className='small endDate'
                  isInvalid={errors.end}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.end && errors.end.message}
                </Form.Control.Feedback>
              </FloatingLabel>
              {/* <Form.Group controlId='end' className='mb-4'>
                <Form.Control
                  {...register('end', {
                    required: t('inputFields.end.required'),
                    validate: val => {
                      return (
                        day(val).isAfter(day(getValues().start)) ||
                        t('inputFields.end.invalid')
                      );
                    }
                  })}
                  type='date'
                  className='small endDate'
                  isInvalid={errors.end}
                />
                <Form.Label>{t('inputFields.end.label')}</Form.Label>
                <Form.Control.Feedback type='invalid'>
                  {errors.end && errors.end.message}
                </Form.Control.Feedback>
              </Form.Group> */}
              <Swipe
                small
                checkedText={t('female')}
                unCheckedText={t('male')}
                value={isFemale}
                className='isFemale'
                onChange={v => setIsFemale(v)}
              />
              {isFemale && (
                <FloatingLabel
                  className='mb-4 small'
                  controlId='period'
                  label={t('inputFields.periodDays.label')}>
                  <Form.Control
                    {...register('period', {
                      required: t('inputFields.periodDays.required'),
                      validate: val => {
                        return (
                          (val < 16 && val > 3) ||
                          t('inputFields.periodDays.invalid')
                        );
                      }
                    })}
                    type='number'
                    min={3}
                    max={15}
                    className='small period'
                    isInvalid={errors.period}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.period && errors.period.message}
                  </Form.Control.Feedback>
                </FloatingLabel>
                //   {/* <Form.Group controlId='period' className='mb-4'>
                //   <Form.Control
                //     {...register('period', {
                //       required: t('inputFields.periodDays.required'),
                //       validate: val => {
                //         return (
                //           (val < 16 && val > 3) ||
                //           t('inputFields.periodDays.invalid')
                //         );
                //       }
                //     })}
                //     type='number'
                //     min={3}
                //     max={15}
                //     className='small period'
                //     isInvalid={errors.period}></Form.Control>
                //   <Form.Label>{t('inputFields.periodDays.label')}</Form.Label>
                //   <Form.Control.Feedback type='invalid'>
                //     {errors.period && errors.period.message}
                //   </Form.Control.Feedback>
                // </Form.Group> */}
              )}
            </>
          )}
          <FloatingLabel
            className='mb-4 small'
            controlId='dailyTarget'
            label={t('inputFields.dailyTarget.label') + ' (' + t('days') + ')'}>
            <Form.Control
              {...register('dailyTarget')}
              type='number'
              className='small dailyTarget'
            />
            <Form.Control.Feedback type='invalid'>
              {errors.dailyTarget && errors.dailyTarget.message}
            </Form.Control.Feedback>
          </FloatingLabel>
          {/* <Form.Group controlId='dailyTarget' className='mb-4'>
            <Form.Control
              {...register('dailyTarget')}
              type='number'
              className='small dailyTarget'></Form.Control>
            <Form.Label>
              {t('inputFields.dailyTarget.label')} ({t('days')})
            </Form.Label>
          </Form.Group> */}
          <Form.Group controlId='save' className='w-100'>
            <Button
              className='w-100 saveSettings btn-slim'
              type='button'
              variant='primary'
              onClick={submitHandler}>
              {t('save')}
            </Button>
          </Form.Group>
          {props.userInfo.user?.preferences.start && (
            <Form.Group controlId='cancel' className='w-100'>
              <Button
                className='w-100 btn-slim'
                type='button'
                variant='link-secondary'
                onClick={() => props.hide()}>
                {t('cancel')}
              </Button>
            </Form.Group>
          )}
        </div>
      )}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
