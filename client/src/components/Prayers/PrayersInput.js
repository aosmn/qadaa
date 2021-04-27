import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import day from 'dayjs';

// import { Link } from 'react-router-dom';
import PrayerItem from './PrayerItem';

import {
  setLogs
} from '../../redux/actions/prayerActions.js';

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  prayerTotals: state.prayerTotals,
  prayers: state.prayerLogs
});

const mapDispatchToProps = dispatch => ({
  setLogs: log => dispatch(setLogs(log))
});

const PrayersCounter = props => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     prayers: {}
  //   };
  // }

  // componentDidMount() {
  //   this.setState({ prayers: props.prayers });
  // }

  let prayers = props.selectedDate.prayers;

  const [fajr, setFajr] = useState(0);
  const [dhuhr, setDhuhr] = useState(0);
  const [asr, setAsr] = useState(0);
  const [maghrib, setMaghrib] = useState(0);
  const [isha, setIsha] = useState(0);
  // const [prayerCounts, setPrayerCounts] = useState({});
  useEffect(() => {
    if (prayers) {
      setFajr(prayers.fajr || 0);
      setDhuhr(prayers.dhuhr || 0);
      setAsr(prayers.asr || 0);
      setMaghrib(prayers.maghrib || 0);
      setIsha(prayers.isha || 0);
    }
  }, [prayers]);
  const addPrayer = prayer => {
    switch (prayer.toLowerCase()) {
      case 'fajr':
        setFajr(fajr + 1);
        break;
      case 'dhuhr':
        setDhuhr(dhuhr + 1);
        break;
      case 'asr':
        setAsr(asr + 1);
        break;
      case 'maghrib':
        setMaghrib(maghrib + 1);
        break;
      case 'isha':
        setIsha(isha + 1);
        break;
      default:
    }
  };
  const addDayPrayers = prayer => {
    setFajr(fajr + 1);
    setDhuhr(dhuhr + 1);
    setAsr(asr + 1);
    setMaghrib(maghrib + 1);
    setIsha(isha + 1);
  };
  const addPrayerMany = (prayer, count) => {
    switch (prayer.toLowerCase()) {
      case 'fajr':
        setFajr(fajr + count);
        break;
      case 'dhuhr':
        setDhuhr(dhuhr + count);
        break;
      case 'asr':
        setAsr(asr + count);
        break;
      case 'maghrib':
        setMaghrib(maghrib + count);
        break;
      case 'isha':
        setIsha(isha + count);
        break;
      default:
    }
  };
  const subtractPrayer = prayer => {
    // setChanged(true)
    switch (prayer.toLowerCase()) {
      case 'fajr':
        setFajr(fajr - 1);
        break;
      case 'dhuhr':
        setDhuhr(dhuhr - 1);
        break;
      case 'asr':
        setAsr(asr - 1);
        break;
      case 'maghrib':
        setMaghrib(maghrib - 1);
        break;
      case 'isha':
        setIsha(isha - 1);
        break;
      default:
    }
    // let counts = prayerCounts;
    // let count = counts[prayer] - 1;
    // counts[prayer] = count;
    // setPrayerCounts(counts);
  };
  const setPrayers = () => {
    props.setLogs({ day: prayers.day, prayers: { fajr, dhuhr, asr, maghrib, isha } });
    props.onCancel();
  };
  const getPrayerCount = prayer => {
    switch (prayer) {
      case 'fajr':
        return fajr;
      case 'dhuhr':
        return dhuhr;
      case 'asr':
        return asr;
      case 'maghrib':
        return maghrib;
      case 'isha':
        return isha;
      default:
    }
  };
  return (
    <>
      <h6>
        <b>{day(props.selectedDate?.prayers?.day).format('ddd DD-MM-YYYY')}</b>
      </h6>
      <div className='prayers-container small d-flex flex-row'>
        <ListGroup className='prayers col px-1 py-2'>
          <PrayerItem
            prayer='Fajr'
            dbTotal={getPrayerCount('fajr')}
            onMakeup={addPrayer}
            onMakeupMany={addPrayerMany}
            onMiss={subtractPrayer}
          />
          <PrayerItem
            prayer='Dhuhr'
            dbTotal={getPrayerCount('dhuhr')}
            onMakeup={addPrayer}
            onMakeupMany={addPrayerMany}
            onMiss={subtractPrayer}
          />
          <PrayerItem
            prayer='Asr'
            dbTotal={getPrayerCount('asr')}
            onMakeup={addPrayer}
            onMakeupMany={addPrayerMany}
            onMiss={subtractPrayer}
          />
          <PrayerItem
            prayer='Maghrib'
            dbTotal={getPrayerCount('maghrib')}
            onMakeup={addPrayer}
            onMakeupMany={addPrayerMany}
            onMiss={subtractPrayer}
          />
          <PrayerItem
            prayer='Isha'
            dbTotal={getPrayerCount('isha')}
            onMakeup={addPrayer}
            onMakeupMany={addPrayerMany}
            onMiss={subtractPrayer}
          />
        </ListGroup>
        <div className='add-day-container'>
          <Button
            type='button'
            variant='primary'
            title='made up a day'
            className='btn-add-many h-100 py-3 px-3 align-items-center'
            onClick={addDayPrayers}>
            <ion-icon name='duplicate-outline'></ion-icon>
            {/* <img
                    src={`${process.env.PUBLIC_URL}/addMany-lt.svg`}
                    width='16'
                    height='16'
                    alt=''
                  /> */}
          </Button>
        </div>
      </div>
      <Row className='mt-3'>
        <Col>
          <Button
            type='button'
            variant='primary'
            title='made up a day'
            className='w-100 h-100 align-items-center'
            onClick={setPrayers}>
            Save
          </Button>
        </Col>
        <Col>
          <Button
            type='button'
            variant='light'
            title='made up a day'
            className='w-100 h-100 align-items-center'
            onClick={() => {props.onCancel()}}>
            Cancel
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PrayersCounter);
