import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Row, Col, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import day from 'dayjs';
import LongPressable from 'react-longpressable';
import 'dayjs/locale/ar';
// import { Link } from 'react-router-dom';
import PrayerItem from './PrayerItem';

import { setLogs } from '../../redux/actions/prayerActions.js';
import { useTranslation } from 'react-i18next';

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  prayerTotals: state.prayerTotals,
  prayers: state.prayerLogs
});

const mapDispatchToProps = dispatch => ({
  setLogs: log => dispatch(setLogs(log))
});

const PrayersCounter = props => {
  const { t, i18n } = useTranslation('home');
  let prayers = props.selectedDate.prayers;

  const [fajr, setFajr] = useState(0);
  const [dhuhr, setDhuhr] = useState(0);
  const [asr, setAsr] = useState(0);
  const [maghrib, setMaghrib] = useState(0);
  const [isha, setIsha] = useState(0);
  const [showManyDays, setShowManyDays] = useState(false);
  const [showPrayerMany, setShowPrayerMany] = useState(false);
  const [prayerManyWhich, setPrayerManyWhich] = useState('');
  const [addPrayersCount, setAddPrayersCount] = useState(2);
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
      case 'all':
        setFajr(fajr + count);
        setDhuhr(dhuhr + count);
        setAsr(asr + count);
        setMaghrib(maghrib + count);
        setIsha(isha + count);
        break;
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
    console.log(props.selectedDate);
    props.setLogs({
      day: props.selectedDate.prayers.day,
      prayers: { fajr, dhuhr, asr, maghrib, isha }
    });
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

  const onLongPress = e => {
    setShowManyDays(true);
    setPrayerManyWhich('all');
  };
  const hidePrayerMany = () => {
    setShowManyDays(false);
    setPrayerManyWhich('');
    setShowPrayerMany(false);
  };

  const submitManyForm = () => {
    const count = parseInt(addPrayersCount);
    addPrayerMany(prayerManyWhich, count);

    setShowPrayerMany(false);
    setShowManyDays(false);
    setPrayerManyWhich('');
    setAddPrayersCount(2);
  };

  return (
    <>
      <h6>
        <b>
          {day(props.selectedDate?.prayers?.day)
            .locale(i18n.language)
            .format('ddd DD-MM-YYYY')}
        </b>
      </h6>

      <h6>
        <small>{t('qadaaLogs')}</small>
      </h6>
      <div className='prayers-container small d-flex flex-row'>
        <div
          className={`overlay ${
            showPrayerMany || showManyDays ? 'shown' : ''
          }`}>
          {(showPrayerMany || showManyDays) && (
            <>
              <Button
                variant='link-light'
                title={t('makeUpMany')}
                className='close-button closeOverlay'
                onClick={() => {
                  hidePrayerMany();
                }}>
                <ion-icon name='close'></ion-icon>
              </Button>
              <div className='content'>
                <h6 className='title text-center'>
                  {showManyDays ? (
                    t('addManyDaysTitle')
                  ) : (
                    <>
                      <span>{t('addManyTitle')}</span>
                      <span className='capitalize px-2'>
                        ({t(prayerManyWhich.toLowerCase())})
                      </span>
                    </>
                  )}
                </h6>
                <Form.Group controlId='prayerCount'>
                  <Form.Control
                    required
                    type='number'
                    min={2}
                    placeholder={`${t('howMany')} ${
                      showManyDays ? t('aldays') : t('alprayers')
                    }${t('?')}`}
                    value={addPrayersCount}
                    onChange={e => setAddPrayersCount(e.target.value)}
                    className={`small ${
                      showManyDays ? 'manyDaysCount' : 'manyPrayersCount'
                    }`}></Form.Control>
                  <Form.Label>
                    {t('howMany')} {showManyDays ? t('aldays') : t('alprayers')}
                    {t('?')}
                  </Form.Label>
                </Form.Group>
                <Form.Group controlId='save' className='w-100'>
                  <Button
                    className='w-100 small saveManyPrayers'
                    type='button'
                    variant='light'
                    onClick={submitManyForm}>
                    {t('save')}
                  </Button>
                </Form.Group>
              </div>
            </>
          )}
        </div>
        <ListGroup className='prayers col px-1 py-2'>
          <PrayerItem
            prayer='Fajr'
            dbTotal={getPrayerCount('fajr')}
            onMakeup={addPrayer}
            onMakeupMany={addPrayerMany}
            onMiss={subtractPrayer}
            onShowAddMany={() => {
              setPrayerManyWhich('fajr');
              setShowPrayerMany(true);
            }}
          />
          <PrayerItem
            prayer='Dhuhr'
            dbTotal={getPrayerCount('dhuhr')}
            onMakeup={addPrayer}
            onMakeupMany={addPrayerMany}
            onMiss={subtractPrayer}
            onShowAddMany={() => {
              setPrayerManyWhich('dhuhr');
              setShowPrayerMany(true);
            }}
          />
          <PrayerItem
            prayer='Asr'
            dbTotal={getPrayerCount('asr')}
            onMakeup={addPrayer}
            onMakeupMany={addPrayerMany}
            onMiss={subtractPrayer}
            onShowAddMany={() => {
              setPrayerManyWhich('asr');
              setShowPrayerMany(true);
            }}
          />
          <PrayerItem
            prayer='Maghrib'
            dbTotal={getPrayerCount('maghrib')}
            onMakeup={addPrayer}
            onMakeupMany={addPrayerMany}
            onMiss={subtractPrayer}
            onShowAddMany={() => {
              setPrayerManyWhich('maghrib');
              setShowPrayerMany(true);
            }}
          />
          <PrayerItem
            prayer='Isha'
            dbTotal={getPrayerCount('isha')}
            onMakeup={addPrayer}
            onMakeupMany={addPrayerMany}
            onMiss={subtractPrayer}
            onShowAddMany={() => {
              setPrayerManyWhich('isha');
              setShowPrayerMany(true);
            }}
          />
        </ListGroup>
        <div className='add-day-container'>
          <LongPressable
            onShortPress={addDayPrayers}
            onLongPress={onLongPress}
            longPressTime={700}>
            <Button
              variant='primary'
              title={t('makeUpDay')}
              className='btn-add-many h-100 py-3 px-3 align-items-center addDay'>
              <ion-icon name='duplicate-outline'></ion-icon>
            </Button>
          </LongPressable>
        </div>
      </div>
      <Row className='mt-3'>
        <Col>
          <Button
            type='button'
            variant='primary'
            title={t('makeUpDay')}
            className='w-100 align-items-center btn-slim'
            onClick={setPrayers}>
            {t('save')}
          </Button>
        </Col>
        <Col>
          <Button
            type='button'
            variant='light'
            title={t('makeUpDay')}
            className='w-100 align-items-center btn-slim'
            onClick={() => {
              props.onCancel();
            }}>
            {t('cancel')}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PrayersCounter);
