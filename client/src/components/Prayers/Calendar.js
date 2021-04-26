import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Modal, Button } from 'react-bootstrap';
import day from 'dayjs';
import Calendar from 'react-calendar';
import { getLogs, setLogs } from '../../redux/actions/prayerActions.js';
import { FAJR, DHUHR, ASR, MAGHRIB, ISHA } from '../../utils/constants';
import Loading from '../../components/Loader';
import Back from '../../components/BackButton';
import 'react-calendar/dist/Calendar.css';

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  prayerLogs: state.prayerLogs
});

const mapDispatchToProps = dispatch => ({
  getLogs: id => dispatch(getLogs(id)),
  setLogs: log => dispatch(setLogs(log))
  // { day, prayer }
});

export class PrayerLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null,
      prayers: null,
      visible: false
    };
  }
  componentDidMount() {
    this.props.getLogs();
  }

  tileClassName = ({ date, view }) => {
    const datesList =
      (this.props.prayerLogs.prayers &&
        this.props.prayerLogs.prayers.length > 0 &&
        this.props.prayerLogs.prayers.map(p => p.day)) ||
      [];
    // Add class to tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (datesList.find(dDate => day(dDate).isSame(day(date), 'day'))) {
        return 'tile has-prayers';
      }
      return 'tile';
    }
  };
  tileContent = ({ date, view }) => {
    const datesList =
      (this.props.prayerLogs.prayers &&
        this.props.prayerLogs.prayers.length > 0 &&
        this.props.prayerLogs.prayers.map(p => ({
          day: p.day,
          count: p.total
        }))) ||
      [];
    // Add class to tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (datesList.find(dDate => day(dDate.day).isSame(day(date), 'day'))) {
        return (
          <div className='count'>
            {
              datesList.find(dDate => day(dDate.day).isSame(day(date), 'day'))
                .count
            }
          </div>
        );
      }
    }
  };
  tileDisabled = ({ date, view }) => {
    // Add class to tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is within any of the ranges
      return day().isBefore(date);
    }
  };
  onChange = nextValue => {
    this.props.onSelect({
      prayers: (this.props.prayerLogs.prayers && this.props.prayerLogs.prayers.find(dDate =>
        day(dDate.day).isSame(nextValue, 'day')
      )) || {
        day: nextValue,
        prayers: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
      }
    });
    this.setState({
      prayers: this.props.prayerLogs.prayers.find(dDate =>
        day(dDate.day).isSame(nextValue, 'day')
      ) || {
        day: nextValue,
        prayers: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
      },
      visible: true
    });
  };

  render() {
    return (
      <>
        <div className='prayers-content d-flex justify-content-center'>
          {this.props.prayerLogs.loading ? (
            <Loading />
          ) : (
            <Calendar
              tileClassName={this.tileClassName}
              tileContent={this.tileContent}
              onChange={this.onChange}
              tileDisabled={this.tileDisabled}
            />
          )}
        </div>
        {/* <PrayersModal
          setLogs={this.props.setLogs}
          prayers={this.state.prayers}
          show={!!this.state.prayers}
          onHide={() => this.setState({ prayers: null })}
        /> */}
      </>
    );
  }
}

const PrayersModal = ({ prayers, setLogs, ...props }) => {
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
    // setChanged(true)
    switch (prayer) {
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
    // let counts = prayerCounts;
    // let count = counts[prayer] + 1;
    // counts[prayer] = count;
    // setPrayerCounts(counts);
  };
  const subtractPrayer = prayer => {
    // setChanged(true)
    switch (prayer) {
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
    setLogs({ day: prayers.day, prayers: { fajr, dhuhr, asr, maghrib, isha } });
    props.onHide();
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
    <Modal
      {...props}
      size='sm'
      aria-labelledby='contained-modal-title-vcenter'
      centered>
      {prayers && (
        <Modal.Header closeButton>
          <Modal.Title>
            {day(prayers.day).format('ddd')}{' '}
            <small className='header-small'>
              {day(prayers.day).format('DD/MM/YYYY')}
            </small>
          </Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {prayers && (
          <div className='prayer-counts'>
            {[FAJR, DHUHR, ASR, MAGHRIB, ISHA].map(key => (
              <div
                className='d-flex flex-column text-center justify-content-center'
                key={key}>
                <div className='prayer-name mb-1 mt-2'>{key}</div>
                <div className='d-flex flex-row align-items-center justify-content-center'>
                  <Button variant='light' onClick={() => subtractPrayer(key)}>
                    -
                  </Button>
                  <div className='mx-2'>{getPrayerCount(key)}</div>
                  <Button variant='light' onClick={() => addPrayer(key)}>
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!(
          prayers?.fajr === fajr &&
          prayers?.dhuhr === dhuhr &&
          prayers?.asr === asr &&
          prayers?.maghrib === maghrib &&
          prayers?.isha === isha
        ) && (
          <Button variant='success' onClick={setPrayers}>
            Update
          </Button>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PrayerLogs);
