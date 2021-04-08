import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Modal, Button } from 'react-bootstrap';
import day from 'dayjs';
import Calendar from 'react-calendar';
import { getLogs } from '../../redux/actions/prayerActions.js';
import { FAJR, DHUHR, ASR, MAGHRIB, ISHA } from '../../utils/constants';
import Back from '../../components/BackButton';
import 'react-calendar/dist/Calendar.css';

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  prayerLogs: state.prayerLogs
});

const mapDispatchToProps = dispatch => ({
  getLogs: id => dispatch(getLogs(id))
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
    this.setState({
      prayers:
        this.props.prayerLogs.prayers.find(dDate =>
          day(dDate.day).isSame(nextValue, 'day')
        ) || null,
      visible: true
    });
  };

  render() {
    return this.props.prayerLogs.loading ? (
      <div>loading...</div>
    ) : (
      // <div>
        <Card>
          <Card.Body>
            <Card.Title>
              <Back />
              Prayer Logs
            </Card.Title>
            <div className='prayers-content d-flex justify-content-center'>
              <Calendar
                tileClassName={this.tileClassName}
                tileContent={this.tileContent}
                onChange={this.onChange}
                tileDisabled={this.tileDisabled}
              />
            </div>
            <PrayersModal
              prayers={this.state.prayers}
              show={!!this.state.prayers}
              onHide={() => this.setState({ prayers: null })}
            />
          </Card.Body>
        </Card>
      // </div>
    );
  }
}

const PrayersModal = ({ prayers, ...props }) => {
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
              <div key={key}>
                <span className='prayer-name'>{key}: </span>
                {prayers[key]}
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PrayerLogs);
