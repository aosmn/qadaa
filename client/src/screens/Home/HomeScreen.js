import React, { useState, useEffect } from 'react';
import Prayers from '../../components/Prayers/PrayersCounter';
import PrayersInput from '../../components/Prayers/PrayersInput';
import Calendar from '../../components/Prayers/Calendar';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import Loading from '../../components/Loader';

import {
  setLogs,
  updateDayLogs,
  getPrayerTotals,
  getDayLogs
} from '../../redux/actions/prayerActions.js';

const mapStateToProps = state => ({
  prayerTotals: state.prayerTotals
});

const mapDispatchToProps = dispatch => ({
  setLogs: log => dispatch(setLogs(log))
});

const HomeScreen = props => {
  const [selectedDate, setSelectedDate] = useState(null);
  const selectDate = selected => {
    setSelectedDate(selected);
  };
  return (
    <Container className='h-100'>
      <Row className='h-100'>
        <Col sm={12} lg={3}>
          <Row>progress</Row>
          <Row>settings</Row>
        </Col>
        <Col
          className='d-flex flex-column justify-content-between'
          sm={12}
          lg={9}>
          <Row>
            <Col sm={12} md={8}>
              <Card>
                <Card.Body>
                  <Prayers />
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={4}>
              <Card className='h-100'>
                <Card.Body className='d-flex flex-column align-items-center justify-content-center'>
                  {props.prayerTotals.loading ? (
                    <Loading />
                  ) : (
                    <>
                      <h5 className='font-weight-bold'>
                        {(props.prayerTotals.totals &&
                          props.prayerTotals.totals[0]?.total) ||
                          0}
                      </h5>
                      <div>
                        <small>Total done</small>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className='d-flex align-items-center h-100 mt-4'>
            <Col className='h-100' sm={12} md={6} lg={5}>
              <Card className='h-100'>
                <Card.Body>
                  <Calendar onSelect={selectDate} />
                </Card.Body>
              </Card>
            </Col>
            <Col className='h-100' sm={12} md={6} lg={7}>
              {!selectedDate ? (
                <Card className='h-100'>
                  <Card.Body className='h-100 d-flex align-items-center justify-content-center'>
                    <div className='text-center'>
                      Select a date to show prayer details
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <Card className='h-100'>
                  <Card.Body>
                    <PrayersInput
                      selectedDate={selectedDate}
                      onCancel={() => {
                        selectDate(null);
                      }}
                    />
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
