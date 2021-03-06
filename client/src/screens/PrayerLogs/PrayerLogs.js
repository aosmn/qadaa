import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListGroup, Card } from 'react-bootstrap';
import day from 'dayjs';
import {
  getLogs,
  updateDayLogs,
  getPrayerTotals
} from '../../redux/actions/prayerActions.js';
import {
  FAJR, DHUHR, ASR, MAGHRIB, ISHA
} from '../../utils/constants';
import Back from '../../components/BackButton'

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  prayerLogs: state.prayerLogs
});

const mapDispatchToProps = dispatch => ({
  getLogs: id => dispatch(getLogs(id))
});

export class PrayerLogs extends Component {
  componentDidMount() {
    this.props.getLogs();
  }
  render() {
    const logsList =
      this.props.prayerLogs.prayers &&
      this.props.prayerLogs.prayers.length > 0 &&
      this.props.prayerLogs.prayers.map(p => (
        <ListGroup.Item action>
          <div className='d-flex flex-row'>
            <div className='date font-weight-bold border-right pr-2'>{day(p.day).format('DD/MM/YYYY')}</div>
            <div className='prayers d-flex flex-row'>
              <div className='prayer-item d-flex flex-row'>
                <div className='label font-weight-bold mr-1 ml-2 capitalise'>{FAJR}</div>
                <div className='value'>{p[FAJR]}</div>
              </div>
              <div className='prayer-item d-flex flex-row'>
                <div className='label font-weight-bold mr-1 ml-2 capitalise'>{DHUHR}</div>
                <div className='value'>{p[DHUHR]}</div>
              </div>
              <div className='prayer-item d-flex flex-row'>
                <div className='label font-weight-bold mr-1 ml-2 capitalise'>{ASR}</div>
                <div className='value'>{p[ASR]}</div>
              </div>
              <div className='prayer-item d-flex flex-row'>
                <div className='label font-weight-bold mr-1 ml-2 capitalise'>{MAGHRIB}</div>
                <div className='value'>{p[MAGHRIB]}</div>
              </div>
              <div className='prayer-item d-flex flex-row'>
                <div className='label font-weight-bold mr-1 ml-2 capitalise'>{ISHA}</div>
                <div className='value'>{p[ISHA]}</div>
              </div>
            </div>
          </div>
        </ListGroup.Item>
      ));
    return (
      <div>
        <Card>
          <Card.Body>
            <Card.Title><Back />Prayer Logs</Card.Title>
            {/* <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle> */}
            {this.props.prayerLogs.loading ? <p>loading</p> :
              <ListGroup>{logsList}</ListGroup>
            }

          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrayerLogs);
