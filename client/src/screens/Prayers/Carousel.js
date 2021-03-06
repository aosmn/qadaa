import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselControl,
  // CarouselIndicators,
  // CarouselCaption,
  Button,
  Form
} from 'react-bootstrap';
import day from 'dayjs';

// import { Link } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import { connect } from 'react-redux';
import { updateUserPreferences } from '../../redux/actions/userActions';
import { getDayLogs } from '../../redux/actions/prayerActions';
import CircularComponent from './CircularComponent';
const mapStateToProps = state => ({
  userInfo: state.userInfo,
  preferences: state.userInfo.user?.preferences || {},
  prayerTotals: state.prayerTotals,
  prayerLogs: state.prayerLogs
});

const mapDispatchToProps = dispatch => ({
  updatePreferences: prefs => dispatch(updateUserPreferences(prefs)),
  getTodayLogs: () => dispatch(getDayLogs())
});

const CarouselComponent = props => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [dailyTarget, setDailyTarget] = useState(
    window.localStorage.getItem('dailyTarget') || 2
  );
  const [isEditTarget, setIsEditTarget] = useState(false);
  const [isEditMakeup, setIsEditMakeup] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(1);
  // const [dailyTargetInput, setDailyTargetInput] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [percent, setPercent] = useState(0);
  const [dailyPercent, setDailyPercent] = useState(0);
  const [totalMadeup, setTotalMadeup] = useState(0);
  const [today, setToday] = useState(0);
  // const {totalMadeup, today} = props;
  // const { preferences, today } = props;
  // const today = 0;
  // const prayers =
  //   window.localStorage.getItem('prayers') &&
  //   JSON.parse(window.localStorage.getItem('prayers'));
  // if (prayers) {
  //   const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  //   prayerNames.forEach(prayer => {
  //     totalMadeup += prayers[prayer];
  //   });
  // }

  // useEffect(() => {
  //   props.getTodayLogs();
  // }, []);
  useEffect(() => {
    if (props.prayerLogs && props.prayerLogs.today) {
      setToday(props.prayerLogs.today.total);
      setDailyPercent(
        Math.round(
          (((props.prayerLogs.today.total || 0) * 100) / (dailyTarget * 5)) *
            100
        ) / 100
      );
    }
  }, [props.prayerLogs]);

  // useEffect(() => {
  // }, [today])
  useEffect(() => {
    console.log(props.prayerTotals);
    if (props.prayerTotals && props.prayerTotals.totals) {
      setTotalMadeup(props.prayerTotals.totals[0]?.total);
    }
  }, [props.prayerTotals]);

  useEffect(() => {
    if (props.preferences) {
      setTotal(props.preferences.days * 5 || 0);
      setDailyPercent(
        Math.round(
          (((props.prayerLogs.today.total || 0) * 100) / (dailyTarget * 5)) *
            100
        ) / 100
      );
    }
  }, [props.preferences, totalMadeup, total]);

  useEffect(() => {
    setTotalRemaining(total - totalMadeup);
  }, [totalMadeup, total]);
  useEffect(() => {
    setPercent(Math.round((((totalMadeup || 0) * 100) / total) * 100) / 100);
  }, [totalMadeup, total]);

  // const total = window.localStorage.getItem('days') * 5;
  // const total = (preferences && preferences.days * 5) || 0;
  // const totalRemaining = total - totalMadeup;
  // const percent = Math.round(((totalMadeup * 100) / total) * 100) / 100;
  // const dailyPercent =
  //   Math.round(((today * 100) / (dailyTarget * 5)) * 100) / 100;
  let dailyTargetInput;
  let makeupDaysInput;
  // console.log((preferences && preferences.days * 5));
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === 2 - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? 2 - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  // const goToIndex = (newIndex) => {
  //   if (animating) return;
  //   setActiveIndex(newIndex);
  // }

  const changeDailyTarget = e => {
    setDailyTarget(e.target.value);
  };

  const onFocus = () => {
    dailyTargetInput.select();
  };
  const onFocusMakeup = () => {
    makeupDaysInput.select();
  };

  const saveDailyTarget = e => {
    // window.localStorage.setItem('dailyTarget', dailyTarget);
    const preferences = props.preferences || {};
    props.updatePreferences({ ...preferences, dailyTarget });
    setIsEditTarget(false);
  };

  const onChangeDays = e => {
    setNumberOfDays(e.target.value);
  };
  const saveMissedPrayers = e => {
    // const updateState = props.updatePreferencesState;
    // // UPDATE PREFERENCES
    props.updatePreferences({
      days: numberOfDays,
      start: day().subtract(numberOfDays, 'days'),
      end: new Date()
    });

    // window.localStorage.setItem('days', numberOfDays)
    // // window.localStorage.setItem('start', start)
    // // window.localStorage.setItem('end', end)
    // window.localStorage.setItem('Fajr', numberOfDays)
    // window.localStorage.setItem('Dhuhr', numberOfDays)
    // window.localStorage.setItem('Asr', numberOfDays)
    // window.localStorage.setItem('Maghrib', numberOfDays)
    // window.localStorage.setItem('Isha', numberOfDays)
    setIsEditMakeup(false);
  };

  const slides = [
    <Carousel.Item
      onExiting={() => setAnimating(true)}
      onExited={() => setAnimating(false)}
      key='totalCounter'>
      {total && total > 0 && !isEditMakeup ? (
        <CircularComponent
          percent={percent}
          total={total}
          totalMadeup={totalMadeup}
          totalRemaining={totalRemaining}
          onEdit={() => setIsEditMakeup(true)}
          editText='Edit Target'
          isFinished={totalMadeup === total}
          finishedText={'Congratulations! you are done with you Qadaa prayers'}
        />
      ) : (
        <>
          <div className='d-flex flex-column justify-content-center mt-5'>
            <div className='target-circle'>
              {!isEditMakeup ? (
                <div className='text-center text-small'>
                  <div className='carousel-text'>
                    Set number of days you missed
                  </div>
                  <Button
                    variant='outline-dark'
                    className='mt-1 step-1'
                    onClick={() => {
                      setIsEditMakeup(true);
                    }}>
                    Setup
                  </Button>
                </div>
              ) : (
                <div className='text-center'>
                  <div className='carousel-text'>
                    How many days do you
                    <br />
                    want to make up?
                  </div>
                  <div className='col-6 d-flex flex-column align-items-center mx-auto'>
                    <Form.Control
                      type='number'
                      name='number'
                      id='count-prayers'
                      placeholder='#'
                      bsSize='sm'
                      className='my-1 text-center pr-0'
                      value={numberOfDays}
                      onChange={onChangeDays}
                      // style={{width: '10%', height: '1rem', borderRadius: 0}}
                      onFocus={onFocusMakeup}
                      ref={ref => (makeupDaysInput = ref)}
                      min={1}
                    />
                    <small>
                      <b>Days</b>
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='d-flex text-light flex-column justify-content-center'>
            {isEditMakeup ? (
              <>
                <div className='mt-4 p-0 d-flex justify-content-center'>
                  <Button
                    variant='link'
                    className='p-0'
                    style={{ color: 'rgb(255, 136, 136)' }}
                    onClick={saveMissedPrayers}>
                    <b>Save</b>
                  </Button>
                </div>
                {/* <Link to='/calculate' variant='link' className='mx-auto very-small-text p-0 text-light'
                  onClick={() => {setIsEditTarget(false)}}
                >
                  <b>Calculate it instead!</b>
                </Link> */}
                <Button
                  className='mx-auto very-small-text p-0 text-dark font-weight-bold'
                  variant='link'
                  onClick={() => setIsEditMakeup(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <div className='mt-4 p-0 d-flex justify-content-center'>
                  <Button
                    variant='link'
                    className='p-0'
                    style={{ color: 'rgb(255, 136, 136)' }}
                    onClick={saveMissedPrayers}>
                    <b>Calculate it instead</b>
                  </Button>
                </div>
                <div className='mx-auto very-small-text'>
                  <b>
                    Use our calculator to calculate the number of days you
                    missed
                  </b>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Carousel.Item>,
    <Carousel.Item
      onExiting={() => setAnimating(true)}
      onExited={() => setAnimating(false)}
      key='dayCounter'>
      {!isEditTarget ? (
        <>
          <CircularComponent
            percent={dailyPercent}
            total={dailyTarget * 5}
            totalMadeup={today}
            totalRemaining={dailyTarget * 5 - today}
            onEdit={() => setIsEditTarget(true)}
            editText='Customize daily target?'
            isFinished={dailyTarget > 0 && dailyTarget * 5 - today === 0}
            finishedText='Well done! you are done for today'
          />
          {/* <div className='d-flex flex-column justify-content-center mt-5'>
            <CircularProgressbar
              className='mx-auto'
              value={dailyPercent}
              // text={`${dailyPercent}%`}
              styles={{
                root: { width: '40%' },
                path: {
                  // Path color
                  stroke: `#fffa`
                },
                trail: {
                  // Trail color
                  stroke: '#fff4'
                },
                text: {
                  fill: '#f88'
                }
              }}
            />

            <div className='circular-progress-text text-center'>
              <div className='percent'>{`${dailyPercent}%`}</div>
              <div>Daily Progress</div>
            </div>
          </div>
          <div className='d-flex text-dark flex-column justify-content-center'>
            <div className='mt-4 p-0 d-flex justify-content-center'>
              <div className='font-weight-bold mx-2'>
                <b>{today}</b>
              </div>
              out of
              <div className='font-weight-bold mx-2'>{dailyTarget * 5}</div>
              prayers
              <br />
            </div>
            <small className='very-small-text mx-auto text-center'>
              {dailyTarget > 0 && dailyTarget * 5 - today === 0 && (
                <b>Well done! you are done for today</b>
              )}
              <div>
                <Button
                  variant='link'
                  className='very-small-text p-0'
                  style={{ color: 'rgb(255, 136, 136)' }}
                  onClick={() => {
                    setIsEditTarget(true);
                  }}>
                  <b>Customize daily target?</b>
                </Button>
              </div>
            </small>
          </div> */}
        </>
      ) : (
        <>
          <div className='d-flex flex-column justify-content-center mt-5'>
            <div className='target-circle'>
              <div className='col-6 d-flex flex-column align-items-center'>
                <Form.Control
                  type='number'
                  name='number'
                  id='count-prayers'
                  placeholder='#'
                  bsSize='sm'
                  className='mb-1 text-center pr-0'
                  value={dailyTarget}
                  onChange={changeDailyTarget}
                  // style={{width: '10%', height: '1rem', borderRadius: 0}}
                  onFocus={onFocus}
                  ref={ref => (dailyTargetInput = ref)}
                  min={1}
                />
                <small>
                  <b>Days</b>
                </small>
              </div>
            </div>
          </div>
          <div className='d-flex text-light flex-column justify-content-center'>
            <div className='mt-4 p-0 d-flex justify-content-center'>
              <Button
                variant='link'
                className='p-0'
                style={{ color: 'rgb(255, 136, 136)' }}
                onClick={saveDailyTarget}>
                <b>Save</b>
              </Button>
            </div>
            <Button
              variant='link'
              className='very-small-text p-0 text-light'
              onClick={() => {
                setIsEditTarget(false);
              }}>
              <b>Cancel</b>
            </Button>
          </div>
        </>
      )}
    </Carousel.Item>
  ];

  return (
    <Carousel
      // activeIndex={activeIndex}
      // next={next}
      // previous={previous}
      // interval={false}
      indicators={false}
      className='mt-4'
      interval={null}
      // activeIndex={index}
      // onSelect={handleSelect}
      // prevIcon=
    >
      {slides}
      {/*
      <CarouselControl
        direction='prev'
        directionText='Previous'
        onClickHandler={previous}
      />
      <CarouselControl
        direction='next'
        directionText='Next'
        onClickHandler={next}
      /> */}
    </Carousel>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CarouselComponent);

// export default CarouselComponent;
