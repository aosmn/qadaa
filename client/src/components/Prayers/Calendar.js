import React, { Component } from 'react';
import { connect } from 'react-redux';
import day from 'dayjs';
import Calendar from 'react-calendar';
import { getLogs, setLogs } from '../../redux/actions/prayerActions.js';
import { LoadingOverlay } from '../../components/Loader';
// import Back from '../../components/BackButton';
import 'react-calendar/dist/Calendar.css';
import { getLogs as getHaderLogs } from '../../redux/actions/haderPrayerActions.js';
var utc = require('dayjs/plugin/utc')
day.extend(utc)

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  prayerLogs: state.prayerLogs,
  haderPrayers: state.haderPrayerLogs
});

const mapDispatchToProps = dispatch => ({
  getLogs: id => dispatch(getLogs(id)),
  setLogs: log => dispatch(setLogs(log)),
  getHaderLogs: id => dispatch(getHaderLogs(id))
  // { day, prayer }
});

export class PrayerLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null,
      prayers: null,
      visible: false,
      offline: !window.navigator.onLine,
      trackHader: props.userInfo?.user?.preferences?.trackHader
    };
  }
  componentDidMount() {
    window.addEventListener('offline', e => {
      this.setState({ offline: true });
    });

    window.addEventListener('online', e => {
      this.setState({ offline: false });
    });
    this.props.getLogs();
    this.props.getHaderLogs();
  }

  tileClassName = ({ date, view }) => {
    const datesList =
      (this.props.prayerLogs.prayers &&
        this.props.prayerLogs.prayers.length > 0 &&
        this.props.prayerLogs.prayers.map(p => p.day)) ||
      [];
    const haderDatesList =
      (this.props.haderPrayers.prayers &&
        this.props.haderPrayers.prayers.length > 0 &&
        this.props.haderPrayers.prayers.map(p => p.day)) ||
      [];
    // Add class to tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (datesList.find(dDate => day(dDate).isSame(day(date), 'day'))) {
        if (haderDatesList.find(dDate => day(dDate).isSame(day(date), 'day'))) {
          return `tile has-prayers has-hader ${
            this.state.trackHader ? 'show-hader' : 'hide-hader'
          }`;
        }
        return `tile has-prayers ${
          this.state.trackHader ? 'show-hader' : 'hide-hader'
        }`;
      }
      if (haderDatesList.find(dDate => day(dDate).isSame(day(date), 'day'))) {
        return `tile has-hader ${
          this.state.trackHader ? 'show-hader' : 'hide-hader'
        }`;
      }
      return `tile ${this.state.trackHader ? 'show-hader' : 'hide-hader'}`;
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

    const haderDatesList =
      (this.props.haderPrayers.prayers &&
        this.props.haderPrayers.prayers.length > 0 &&
        this.props.haderPrayers.prayers.map(p => ({
          day: p.day,
          done: p.fajr && p.dhuhr && p.asr && p.maghrib && p.isha
        }))) ||
      [];
    const hasPrayers = datesList.find(({ day: cDay }) =>
      day(cDay).isSame(day(date), 'day')
    );
    // console.log(hasPrayers);
    const prayersCount = hasPrayers?.count;

    const hasHader = haderDatesList.find(({ day: cDay }) =>
      day(cDay).isSame(day(date), 'day')
    );
    const haderDoneAll = hasHader?.done;
    const getHaderDay = this.props.haderPrayers?.prayers?.find(
      ({ day: cDay }) => day(cDay).isSame(day(date), 'day')
    );
    // Add class to tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to

      return (
        <>
          {hasPrayers && <div className='count'>{prayersCount}</div>}
          {hasHader ? (
            <div
              className={`hader-done${haderDoneAll ? '' : ' partial'}`}
              onClick={e => {
                e.stopPropagation();
                this.props.onSelectHader({
                  prayers: getHaderDay
                });
              }}>
              {/* {haderDoneAll ? (
                <ion-icon name='checkmark-done-outline'></ion-icon>
              ) : (
              )} */}
              <ion-icon name='checkmark-outline'></ion-icon>
            </div>
          ) : (
            <div
              className='hader-empty'
              onClick={e => {
                e.stopPropagation();
                this.props.onSelectHader({
                  prayers: {
                    day: date,
                    fajr: false,
                    dhuhr: false,
                    asr: false,
                    maghrib: false,
                    isha: false
                  }
                });
              }}></div>
          )}
        </>
      );
    }
  };
  tileContentOld = ({ date, view }) => {
    const datesList =
      (this.props.prayerLogs.prayers &&
        this.props.prayerLogs.prayers.length > 0 &&
        this.props.prayerLogs.prayers.map(p => ({
          day: p.day,
          count: p.total
        }))) ||
      [];

    const haderDatesList =
      (this.props.haderPrayers.prayers &&
        this.props.haderPrayers.prayers.length > 0 &&
        this.props.haderPrayers.prayers.map(p => ({
          day: p.day,
          done: p.fajr && p.dhuhr && p.asr && p.maghrib && p.isha
        }))) ||
      [];

    const hasPrayers = datesList.find(({ day: cDay }) =>
      day(cDay).isSame(day(date), 'day')
    );
    const prayersCount = hasPrayers?.count;

    const hasHader = haderDatesList.find(({ day: cDay }) =>
      day(cDay).isSame(day(date), 'day')
    );
    const haderDoneAll = hasHader?.done;

    const getHaderDay = this.props.haderPrayers.prayers.find(({ day: cDay }) =>
      day(cDay).isSame(day(date), 'day')
    );
    // Add class to tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (hasPrayers) {
        if (hasHader && haderDoneAll) {
          return (
            <>
              <div className='count'>{prayersCount}</div>
              <div className='hader-done'>
                <ion-icon name='checkmark-outline'></ion-icon>
              </div>
            </>
          );
        }
        // !haderDone
        return (
          <>
            <div className='count'>{prayersCount}</div>
            <div
              className='hader-empty hader-done'
              onClick={e => {
                e.stopPropagation();
                this.props.onSelectHader({
                  prayers: hasHader || {
                    day: date,
                    prayers: {
                      fajr: false,
                      dhuhr: false,
                      asr: false,
                      maghrib: false,
                      isha: false
                    }
                  }
                });
              }}></div>
          </>
        );
      }
      if (
        haderDatesList.find(dDate => day(dDate.day).isSame(day(date), 'day'))
      ) {
        return (
          <>
            <div
              className={`hader-done ${
                hasHader && haderDoneAll ? '' : 'hader-empty'
              }`}
              onClick={e => {
                e.stopPropagation();
                // console.log(getHaderDay);
                this.props.onSelectHader({
                  prayers: getHaderDay || {
                    day: date,
                    prayers: {
                      fajr: false,
                      dhuhr: false,
                      asr: false,
                      maghrib: false,
                      isha: false
                    }
                  }
                });
              }}>
              {haderDatesList.find(dDate =>
                day(dDate.day).isSame(day(date), 'day')
              ) &&
                haderDatesList.find(dDate =>
                  day(dDate.day).isSame(day(date), 'day')
                ).done && <ion-icon name='checkmark-outline'></ion-icon>}
            </div>
          </>
        );
      }
      return (
        <div
          className='hader-empty hader-done'
          onClick={e => {
            e.stopPropagation();
            // console.log(date);
            this.props.onSelectHader({
              prayers: getHaderDay || {
                day: date,
                prayers: {
                  fajr: false,
                  dhuhr: false,
                  asr: false,
                  maghrib: false,
                  isha: false
                }
              }
            });
          }}></div>
      );
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
    console.log(nextValue);
    this.props.onSelect({
      prayers: (this.props.prayerLogs.prayers &&
        this.props.prayerLogs.prayers.length > 0 &&
        this.props.prayerLogs.prayers.find(dDate =>
          day(dDate.day).isSame(nextValue, 'day')
        )) || {
        day: day(nextValue).utc(),
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
    const lang = localStorage.getItem('i18nextLng') || 'ar';
    return (
      <>
        <div className='h-100 prayers-content d-flex justify-content-center'>
          {this.state.offline ? (
            <div className='loading-overlay'>
              <p>Logs not available offline</p>
            </div>
          ) : this.props.prayerLogs.loading ||
            this.props.haderPrayers.loading ||
            this.props.haderPrayers.updateLoading ? (
            <LoadingOverlay />
          ) : (
            <Calendar
              calendarType='Arabic'
              locale={lang}
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
