import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Badge
} from 'react-bootstrap';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
// import {
//   getTodayLogs,
//   missedPrayer,
//   makeUpPrayer,
//   getPrayerCount,
//   makeUpDayPrayer
// } from '../../services/DBHelper';
// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';

import PrayerItem from './PrayerItem';
import Carousel from './Carousel';

import {
  getLogs,
  updateDayLogs,
  getPrayerTotals,
  getDayLogs
} from '../../redux/actions/prayerActions.js';

const mapStateToProps = state => ({
  // prayers: state.prayers.prayers,
  // isOff/line: !state.network.isOnline || !state.auth.isLoggedIn,
  userInfo: state.userInfo,
  prayerTotals: state.prayerTotals,
  prayers: state.prayerLogs
});

const mapDispatchToProps = dispatch => ({
  // logPrayer: (prayer, count, isOffline) =>
  //   dispatch(logPrayer(prayer, count, isOffline)),
  // log5Prayers: (count, isOffline) => dispatch(log5Prayers(count, isOffline)),
  getLogs: id => dispatch(getLogs(id)),
  getPrayerTotals: id => dispatch(getPrayerTotals(id)),
  updateDayLogs: log => dispatch(updateDayLogs(log)),
  // getDayLogs: day => dispatch(getDayLogs(day)),
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
    // const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    // this.setState({
    //   preferences: JSON.parse(window.localStorage.getItem('preferences'))
    // });
    // prayers.forEach(prayer => {
    //   getPrayerCount(prayer).then(total => {
    //     this.setState({ [prayer + 'DBTotal']: total });
    //   });
    // });
    // getTodayLogs().then(r => {
    //   if (r) {
    //     const sum =
    //       (r.fajr || 0) +
    //       (r.dhuhr || 0) +
    //       (r.asr || 0) +
    //       (r.maghrib || 0) +
    //       (r.isha || 0);
    //     // console.log(sum);
    //     this.setState({ today: sum });
    //     this.props.getTodayPrayerCount(sum);
    //   }
    // });
    if (this.props.userInfo && this.props.userInfo.user) {
      this.props.getPrayerTotals(this.props.userInfo.user._id);
      this.props.getLogs(this.props.userInfo.user._id);
      // this.props.getDayLogs(new Date());
      this.props.getTodayLogs();

    }
  }

  startTimer = () => {
    clearInterval(this.timer);
    this.setState({ timerRunning: true, timer: 0 });

    this.timer = setInterval(() => {
      if (this.state.timer < 30) {
        // console.log('count', this.state.timer);
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
    // missedPrayer(prayer, 1, new Date()).then(newEntry => {
    //   let field = `${prayer}DBTotal`;
    //   let old = this.state[field]
    this.setState({ today: this.state.today - 1 });
    // })
  };

  onMakeup = prayer => {
    this.props.updateDayLogs({ day: new Date(), prayer, count: 1 });
    // makeUpPrayer(prayer, 1, new Date()).then(newEntry => {
    //   let field = `${prayer}DBTotal`;
    //   let old = this.state[field]
    this.setState({ today: this.state.today + 1 });
    // })
  };

  onMakeupMany = (prayer, count) => {
    // console.log(prayer, count);
    // this.props.logPrayer(prayer, count, this.props.isOffline);
    this.props.updateDayLogs({ day: new Date(), prayer, count });

    // makeUpPrayer(prayer, count, new Date()).then(newEntry => {
    //   let field = `${prayer}DBTotal`;
    //   let old = this.state[field]
    this.setState({ today: this.state.today + count });
    // })
  };

  onMakeupDays = e => {
    const count = parseInt(this.state.dayCount, 10, this.props.isOffline);
    if (count > 0) {
      // makeUpDayPrayer(count, new Date()).then(newEntries => {
      //   let newState = {};
      //   for(let i=0; i<newEntries.length; i++) {
      //     const name = newEntries[i].prayer;
      //     const field = `${name}DBTotal`;
      //     const old = this.state[field]
      //     newState[field] = old + parseInt(count, 10);
      //   }
      // })
      // this.props.log5Prayers(count, this.props.isOffline);

      // this.setState({
      //   dayCount: 2,
      //   today: this.state.today + count * 5,
      //   showManyDays: false
      // });

      this.props.updateDayLogs({ day: new Date(), prayer: 'all', count });
      this.setState({ today: this.state.today + count * 5 });
    }
  };

  onMakeupOneDay = e => {
    this.startTimer();
    if (this.state.timerRunning) {
      // console.log('hena');
      let newCounter = this.state.clicksCounter + 1;
      let newState = { clicksCounter: newCounter };
      if (newCounter === 2) {
        newState.showManyDays = true;
      }
      this.setState(newState);
    } else {
      this.setState({ clicksCounter: 1 });
    }
    // const count = parseInt(this.state.dayCount, 10);
    // if (count > 0) {
    // makeUpDayPrayer(1, new Date()).then(newEntries => {
    //   let newState = {};
    //   for(let i=0; i<newEntries.length; i++) {
    //     const name = newEntries[i].prayer;
    //     const field = `${name}DBTotal`;
    //     const old = this.state[field]
    //     newState[field] = old + parseInt(1, 10);
    //   }
    // this.setState({ today: this.state.today + 5 });
    // })
    // }
    // this.props.log5Prayers(1, this.props.isOffline);

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
      // timer: 0,
      // timerRunning: false,
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
    // console.log(prayers);
    const totalMadeup =
      this.state.FajrDBTotal +
      this.state.DhuhrDBTotal +
      this.state.AsrDBTotal +
      this.state.MaghribDBTotal +
      this.state.IshaDBTotal;
    // const total = window.localStorage.getItem('days') * 5;
    // const totalRemaining = total - totalMadeup;
    // const percent = Math.round((totalMadeup*100/total) * 100) / 100
    // console.log(this.props.prayers.total);
    return (
      <Container>
        <Row className='d-flex flex-column align-items-center'>
          <Col sm={{ size: 12 }} md={{ size: 7 }}>
            {this.state.showManyDays ? (
              <Col className='day-container ml-auto'>
                <div className='d-flex ml-auto align-items-center'>
                  <Button
                    variant='link'
                    onClick={this.cancelMany}
                    className='text-light ml-auto d-flex'>
                    {/* <img
                      src={`${process.env.PUBLIC_URL}/cancel-dk.svg`}
                      alt=''
                      width='12'
                      height='12'
                    /> */}
                    <ion-icon name='close'></ion-icon>
                  </Button>
                  <small className='ml-auto mr-2'>
                    Add multiple days' prayers
                  </small>
                  <Form.Control
                    type='number'
                    name='number'
                    id='count-prayers'
                    placeholder='#'
                    bsSize='sm'
                    className='col mx-2 custom-input'
                    value={this.state.dayCount}
                    onChange={this.changeDayCount}
                    style={{ width: '10%', height: '1rem', borderRadius: 0 }}
                    onFocus={this.onFocus}
                    ref={ref => {
                      console.log('hena');
                      console.log(ref);
                      this.input = ref;
                    }}
                  />
                  {/* <Button className='btn-success py-0 btn-counter px-2' data-name='all' onClick={this.onMiss}>-</Button> */}
                  <Button
                    variant='info'
                    className='py-0 btn-counter btn-round px-2 py-1 d-flex'
                    data-name='all'
                    onClick={this.onMakeupDays}>
                    <ion-icon
                      name='duplicate-outline'
                      text='add many'></ion-icon>
                    {/* <img
                      src={`${process.env.PUBLIC_URL}/addMany-lt.svg`}
                      width='16'
                      height='16'
                      alt=''
                    /> */}
                  </Button>
                </div>
              </Col>
            ) : (
              <Col>
                <Button
                  onClick={this.showMany}
                  variant='link'
                  className='p-0 m-0 border-0 ml-auto step-8'>
                  <Badge className='add-many-badge'>
                    Add many days
                    <img
                      src={`${process.env.PUBLIC_URL}/history.svg`}
                      width='10'
                      height='10'
                      alt=''
                      className='ml-1'
                    />
                  </Badge>
                </Button>
              </Col>
            )}
            <div className='d-flex flex-row'>
              <ListGroup className='prayer-counts col px-0'>
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
                  variant='info'
                  title='made up a day'
                  className='add-many-btn h-100 py-3 px-2 align-items-center'
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
            <Link to='/logs'>
              <Badge className='history-badge step-9 d-flex'>
                <span className='mr-1'>Logs</span>
                <ion-icon name='time-outline'></ion-icon>
                {/* <img
                  src={`${process.env.PUBLIC_URL}/history.svg`}
                  width='10'
                  height='10'
                  alt=''
                  className='ml-2'
                /> */}
              </Badge>
            </Link>
            <Link to='/calculate'>
              <Badge className='history-badge mr-2 step-2 d-flex'>
                <span className='mr-1'>Calculate</span>
                <ion-icon name='calculator-outline'></ion-icon>
                {/* <img
                  src={`${process.env.PUBLIC_URL}/calculator.svg`}
                  width='10'
                  height='10'
                  alt=''
                  className='ml-2'
                /> */}
              </Badge>
            </Link>
            <Carousel totalMadeup={totalMadeup} today={this.state.today} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrayersCounter);
