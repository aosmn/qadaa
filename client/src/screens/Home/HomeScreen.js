import React, { useState, useEffect } from 'react';
import Prayers from '../../components/Prayers/PrayersCounter';
import PrayersInput from '../../components/Prayers/PrayersInput';
import Calendar from '../../components/Prayers/Calendar';
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Button,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import Loading from '../../components/Loader';
import day from 'dayjs';
import { updateUserPreferences } from '../../redux/actions/userActions';
import {
  setLogs,
  getDayLogs
} from '../../redux/actions/prayerActions.js';

import Settings from '../../components/Settings';
import { objectEmpty } from '../../utils/utils';

const mapStateToProps = state => ({
  prayerTotals: state.prayerTotals,
  today: state.prayerLogs.today?.total || 0,
  userInfo: state.userInfo
});

const mapDispatchToProps = dispatch => ({
  setLogs: log => dispatch(setLogs(log)),
  getDayLogs: date => dispatch(getDayLogs(date)),
  updatePreferences: (prefs, user) =>
    dispatch(updateUserPreferences(prefs, user))
});

const HomeScreen = props => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const [dailyTarget] = useState(
    props.userInfo?.user?.preferences?.dailyTarget || 2
  );

  const selectDate = selected => {
    setSelectedDate(selected);
  };
  let total = props.userInfo?.user?.preferences?.days * 5;
  // let dailyTarget = props.userInfo?.user?.preferences.dailyTarget * 5 || 10;
  useEffect(() => {
    props.getDayLogs(new day());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const round2 = num => {
    const rounded = Math.floor(num * 100) / 100;
    return rounded;
  };
  return (
    <Container className='h-100'>
      <Row className='h-100'>
        <Col sm={12} lg={3}>
          <Row className='mb-4 h-100'>
            <Col>
              <Card>
                <Card.Body>
                  <h6 className='font-weight-bold mb-0 d-flex align-items-center'>
                    Salam {props.userInfo.user.name?.split(' ')[0]}
                    {showSettings ? (
                      <Button
                        variant='link'
                        className='btn text-dark p-0 ml-auto'
                        onClick={() => {
                          setShowSettings(false);
                        }}>
                        <ion-icon name='close'></ion-icon>
                      </Button>
                    ) : (
                      !objectEmpty(props.userInfo.user.preferences) && (
                        <Button
                          variant='link'
                          className='btn text-dark p-0 ml-auto'
                          onClick={() => {
                            setShowSettings(true);
                          }}>
                          <ion-icon name='settings-outline'></ion-icon>
                        </Button>
                      )
                    )}
                  </h6>

                  {objectEmpty(props.userInfo.user.preferences) && (
                    <small>Welcome! Set up your target</small>
                  )}
                  {!showSettings &&
                    !objectEmpty(props.userInfo?.user?.preferences) && (
                      <>
                        <div className='progress-container'>
                          <div>
                            <h6 className='font-weight-bold mb-0'>
                              Today's progress
                            </h6>
                          </div>
                          <div className='label'>
                            <b>{props.today}</b> prayers out of{' '}
                            <b>{dailyTarget * 5}</b>{' '}
                            <small>
                              (
                              {round2(
                                ((props.today || 0) * 100) / (dailyTarget * 5)
                              )}
                              %)
                            </small>
                          </div>
                          <ProgressBar
                            className='mt-3'
                            now={round2(
                              (props.today * 100) / (dailyTarget * 5)
                            )}
                            // label={`${(props.today * 100) / 10}%`}
                          />
                        </div>
                        <div className='progress-container'>
                          <h6 className='font-weight-bold mb-0'>
                            Overall progress
                          </h6>
                          <div className='label'>
                            <b>
                              {(props.prayerTotals &&
                                props.prayerTotals.totals &&
                                props.prayerTotals.totals[0]?.total) ||
                                0}
                            </b>{' '}
                            prayers out of <b>{total}</b>{' '}
                            <small>
                              (
                              {props.prayerTotals &&
                                props.prayerTotals.totals &&
                                round2(
                                  ((props.prayerTotals.totals[0]?.total || 0) *
                                    100) /
                                    total
                                )}
                              %)
                            </small>
                          </div>
                          <ProgressBar
                            className='mt-3'
                            now={
                              props.prayerTotals &&
                              props.prayerTotals.totals &&
                              round2(
                                ((props.prayerTotals.totals[0]?.total || 0) *
                                  100) /
                                  total
                              )
                            }
                            // label={`${
                            //   props.prayerTotals &&
                            //   props.prayerTotals.totals &&
                            //   ((props.prayerTotals.totals[0]?.total || 0) * 100) /
                            //     total
                            // }%`}
                          />
                        </div>
                      </>
                    )}
                  <div className='progress-container mb-0'>
                    {/* {objectEmpty(props.userInfo?.user?.preferences) ? ( */}
                    <Settings
                      show={
                        showSettings ||
                        objectEmpty(props.userInfo?.user?.preferences)
                      }
                      hide={() => setShowSettings(false)}
                    />
                    {/* ) : (
                      <p>setup your account</p>
                    )} */}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* <Row>
            <Col>
              <Card>
                <Card.Body>
                  <h6>Settings</h6>
                </Card.Body>
              </Card>
            </Col>
          </Row> */}
        </Col>
        <Col className='d-flex flex-column' sm={12} lg={9}>
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
          <Row className='d-flex align-items-center mt-4'>
            <Col className='h-100' sm={12} md={6} lg={5}>
              <Card className='h-100' style={{ minHeight: '317px' }}>
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
