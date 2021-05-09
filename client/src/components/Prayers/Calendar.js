import React, { Component } from 'react';
import { connect } from 'react-redux';
import day from 'dayjs';
import Calendar from 'react-calendar';
import { getLogs, setLogs } from '../../redux/actions/prayerActions.js';
import { LoadingOverlay } from '../../components/Loader';
// import Back from '../../components/BackButton';
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
      visible: false,
      offline: !window.navigator.onLine
    };
  }
  componentDidMount() {
    window.addEventListener('offline', (e) => {
      this.setState({ offline: true });
    });

    window.addEventListener('online', (e) => {
      this.setState({ offline: false });
    });
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
      prayers: (this.props.prayerLogs.prayers &&
        this.props.prayerLogs.prayers.length > 0 &&
        this.props.prayerLogs.prayers.find(dDate =>
          day(dDate.day).isSame(nextValue, 'day')
        )) || {
        day: nextValue,
        prayers: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
      }
    });
    this.setState({
      prayers:
        this.props.prayerLogs.prayers &&
        this.props.prayerLogs.prayers.length > 0
          ? this.props.prayerLogs.prayers.find(dDate =>
              day(dDate.day).isSame(nextValue, 'day')
            )
          : {
              day: nextValue,
              prayers: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
            },
      visible: true
    });
  };

  render() {
    return (
      <>
        <div className='h-100 prayers-content d-flex justify-content-center'>
          {this.state.offline ? (
            <div className='loading-overlay'>
              <p>Logs not available offline</p>
            </div>
          ) : this.props.prayerLogs.loading ? (
            <LoadingOverlay />
          ) : (
            <Calendar
              tileClassName={this.tileClassName}
              tileContent={this.tileContent}
              onChange={this.onChange}
              tileDisabled={this.tileDisabled}
            />
          )}
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrayerLogs);
