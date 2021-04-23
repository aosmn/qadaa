import React, { Component } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

// import { Link } from 'react-router-dom';
import PrayerItem from './PrayerItem';

import {
  getLogs,
  updateDayLogs,
  getPrayerTotals,
  getDayLogs
} from '../../redux/actions/prayerActions.js';

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  prayerTotals: state.prayerTotals,
  prayers: state.prayerLogs
});

const mapDispatchToProps = dispatch => ({
  getLogs: id => dispatch(getLogs(id)),
  getPrayerTotals: id => dispatch(getPrayerTotals(id)),
  updateDayLogs: log => dispatch(updateDayLogs(log)),
  getTodayLogs: () => dispatch(getDayLogs())
});

class PrayersCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FajrDBTotal: 0,
      DhuhrDBTotal: 0,
      AsrDBTotal: 0,
      MaghribDBTotal: 0,
      IshaDBTotal: 0,
      dayCount: 2,
      prayer: '',
      today: 0,
      showManyDays: false,
      timer: 0,
      timerRunning: false,
      clicksCounter: 0,
      preferences: {}
    };
  }

  componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.user) {
      this.props.getPrayerTotals(this.props.userInfo.user._id);
      this.props.getLogs(this.props.userInfo.user._id);
      this.props.getTodayLogs();
    }
  }

  startTimer = () => {
    clearInterval(this.timer);
    this.setState({ timerRunning: true, timer: 0 });

    this.timer = setInterval(() => {
      if (this.state.timer < 30) {
        this.setState({ timer: this.state.timer + 1 }, () => {
          if (this.state.showManyDays) {
            clearInterval(this.timer);
          }
        });
      } else {
        this.setState({ timer: 0, timerRunning: false });
        clearInterval(this.timer);
      }
    }, 1000);
  };

  onMiss = prayer => {
    this.props.updateDayLogs({ day: new Date(), prayer, count: -1 });
    this.setState({ today: this.state.today - 1 });
  };

  onMakeup = prayer => {
    this.props.updateDayLogs({ day: new Date(), prayer, count: 1 });
    this.setState({ today: this.state.today + 1 });
  };

  onMakeupMany = (prayer, count) => {
    this.props.updateDayLogs({ day: new Date(), prayer, count });
    this.setState({ today: this.state.today + count });
  };

  onMakeupDays = e => {
    const count = parseInt(this.state.dayCount, 10, this.props.isOffline);
    if (count > 0) {
      this.props.updateDayLogs({ day: new Date(), prayer: 'all', count });
      this.setState({ today: this.state.today + count * 5 });
    }
  };

  onMakeupOneDay = e => {
    this.startTimer();
    if (this.state.timerRunning) {
      let newCounter = this.state.clicksCounter + 1;
      let newState = { clicksCounter: newCounter };
      if (newCounter === 2) {
        newState.showManyDays = true;
      }
      this.setState(newState);
    } else {
      this.setState({ clicksCounter: 1 });
    }
    this.props.updateDayLogs({ day: new Date(), prayer: 'all', count: 1 });
    this.setState({ today: this.state.today + 1 });
  };

  changeDayCount = e => {
    this.setState({ dayCount: e.target.value });
  };

  calculateCurrentTotal = prayer => {
    return (
      parseInt(window.localStorage.getItem(prayer)) -
      this.state[prayer + 'DBTotal']
    );
  };
  getWidth = (value, prayer) => {
    return (value / window.localStorage.getItem(prayer)) * 100 + '%';
  };
  cancelMany = () => {
    this.setState({
      showManyDays: false,
      clicksCounter: 0
    });
  };
  showMany = () => {
    this.setState({
      showManyDays: true,
      clicksCounter: 0
    });
  };
  onFocus = () => {
    this.input.select();
  };
  updatePreferences = () => {
    this.setState({
      preferences: JSON.parse(window.localStorage.getItem('preferences'))
    });
  };
  render() {
    let prayers =
      this.props.prayerTotals.totals && this.props.prayerTotals.totals[0];
    return (
          <div className='prayers-container d-flex flex-row'>
            <ListGroup className='prayers col px-1 py-2'>
              <PrayerItem
                prayer='Fajr'
                dbTotal={prayers && prayers.fajr}
                onMakeup={this.onMakeup}
                onMakeupMany={this.onMakeupMany}
                onMiss={this.onMiss}
              />
              <PrayerItem
                prayer='Dhuhr'
                dbTotal={prayers && prayers['dhuhr']}
                onMakeup={this.onMakeup}
                onMakeupMany={this.onMakeupMany}
                onMiss={this.onMiss}
              />
              <PrayerItem
                prayer='Asr'
                dbTotal={prayers && prayers['asr']}
                onMakeup={this.onMakeup}
                onMakeupMany={this.onMakeupMany}
                onMiss={this.onMiss}
              />
              <PrayerItem
                prayer='Maghrib'
                dbTotal={prayers && prayers['maghrib']}
                onMakeup={this.onMakeup}
                onMakeupMany={this.onMakeupMany}
                onMiss={this.onMiss}
              />
              <PrayerItem
                prayer='Isha'
                dbTotal={prayers && prayers['isha']}
                onMakeup={this.onMakeup}
                onMakeupMany={this.onMakeupMany}
                onMiss={this.onMiss}
              />
            </ListGroup>
            <div className='add-day-container'>
              <Button
                variant='primary'
                title='made up a day'
                className='btn-add-many h-100 py-3 px-3 align-items-center'
                onClick={this.onMakeupOneDay}>
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
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrayersCounter);
