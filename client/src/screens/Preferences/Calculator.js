import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Container, Row, Col } from 'react-bootstrap';
import day from 'dayjs';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { updateUserPreferences } from '../../redux/actions/userActions';
import { connect } from 'react-redux';
var duration = require('dayjs/plugin/duration')
day.extend(duration);

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

const mapDispatchToProps = dispatch => ({
  // getPreferences: () => dispatch(getPreferences()),
  updatePreferences: (prefs, user) =>
    dispatch(updateUserPreferences(prefs, user))
});

const Calculator = props => {
  // const preferences = (window.localStorage.getItem('preferences') && JSON.parse(window.localStorage.getItem('preferences'))) || {}
  const [preferences, setPreferences] = useState({});
  const [isFemale, setIsFemale] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [periodDays, setPeriodDays] = useState(0);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  // useEffect(() => {
  //   props.getPreferences();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    console.log('prefs', props.userInfo);
    if (
      props.userInfo &&
      props.userInfo.user &&
      props.userInfo.user.preferences
    ) {
      const prefs = props.userInfo.user.preferences;
      setPreferences(prefs);
      setIsFemale(prefs.period && prefs.period > 0);
      setNumberOfDays(prefs.days || 0);
      setPeriodDays(prefs.period || 0);
      setStart(prefs.start ? new Date(prefs.start) : new Date());
      setEnd(prefs.end ? new Date(prefs.end) : new Date());
    }
  }, []);

  const onChange = e => {
    switch (e.target.name) {
      case 'gender':
        const female = e.target.value === 'female';
        setIsFemale(female);
        if (!female) {
          setPeriodDays(0);
        }
        break;
      case 'periodDays':
        setPeriodDays(e.target.value);
        break;
      case 'start':
        setStart(e.target.value);
        break;

      case 'end':
        setEnd(e.target.value);
        break;
      default:
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    const startDate = day(start),
      endDate = day(end),
      period = periodDays || 0;
    // console.log(isFemale);
    const duration = day.duration(endDate.diff(startDate));
    const totalDays = Math.ceil(
      duration.asDays() - period * duration.asMonths()
    );
    // console.log(duration.asDays)
    // console.log(duration.asMonths)
    setNumberOfDays(isFemale ? totalDays : Math.ceil(duration.asDays()));
  };

  const onSave = e => {
    props.updatePreferences(
      {
        start,
        end,
        // totalPrayers: numberOfDays*5,
        days: numberOfDays,
        period: periodDays,
        updatedAt: new Date()
      },
      props.user
    );
    props.history.push('/');
  };
  return (
    <Container>
      <Row>
        <Col
          sm={{ size: 5 }}
          md={{ size: 8 }}
          lg={{ size: 5 }}
          className='mx-auto'>
          <div className='calculator'>
            <Link to='/' className='text-light ml-auto'>
              <img
                src={`${process.env.PUBLIC_URL}/cancel.svg`}
                alt=''
                width='12'
                height='12'
              />
            </Link>
            <h3 className='text-center mb-4'>Qadaa' Calculator</h3>
            <Form onSubmit={onSubmit}>
              <Row>
                <Col sm={{ size: 6 }}>
                  <FormGroup>
                    <Form.Label for='startTime'>Start Time</Form.Label>
                    <Form.Control
                      type='date'
                      name='start'
                      id='startTime'
                      placeholder='Start time'
                      value={day(start).format('YYYY-MM-DD')}
                      onChange={onChange}
                    />
                  </FormGroup>
                </Col>
                <Col sm={{ size: 6 }}>
                  <FormGroup>
                    <Form.Label for='endTime'>End Time</Form.Label>
                    <Form.Control
                      type='date'
                      name='end'
                      id='endTime'
                      placeholder='End time'
                      value={day(end).format('YYYY-MM-DD')}
                      onChange={onChange}
                    />
                  </FormGroup>
                </Col>
                <Col sm={{ size: 12 }}>
                  <FormGroup tag='fieldset'>
                    <FormGroup check>
                      <Form.Label check>
                        <Form.Control
                          type='radio'
                          name='gender'
                          onChange={onChange}
                          value='male'
                          checked={!isFemale}
                        />
                        Male
                      </Form.Label>
                    </FormGroup>
                    <FormGroup check>
                      <Form.Label check>
                        <Form.Control
                          type='radio'
                          name='gender'
                          onChange={onChange}
                          value='female'
                          checked={isFemale}
                        />
                        Female
                      </Form.Label>
                    </FormGroup>
                  </FormGroup>
                </Col>
                {isFemale ? (
                  <Col sm={{ size: 12 }}>
                    <FormGroup>
                      <Form.Label for='periodDays'>
                        Period Length{' '}
                        <div className='text-secondary'>(days)</div>
                      </Form.Label>
                      <Form.Control
                        id='periodDays'
                        type='number'
                        name='periodDays'
                        value={periodDays}
                        onChange={onChange}
                        min={0}
                      />
                    </FormGroup>
                  </Col>
                ) : null}
              </Row>
              <Button variant='success' className='col' type='sumbit'>
                Calculate
              </Button>
            </Form>
            {numberOfDays > 0 ? (
              <>
                <hr />
                <div className='text-center'>
                  <h5 className='mb-0'>Number of days</h5>
                  <small className='text-secondary'>
                    Total number of days you need to make up
                  </small>
                  <p>{numberOfDays}</p>
                  <h5 className='mb-0'>Number of prayers</h5>
                  <small className='text-secondary'>
                    Total number of prayers you need to make up
                  </small>
                  <p>{numberOfDays * 5}</p>
                </div>
                {window.localStorage.getItem('days') &&
                window.localStorage.getItem('days') === numberOfDays ? null : (
                  <Button onClick={onSave} color='light'>
                    Save and Start Making up
                  </Button>
                )}
              </>
            ) : null}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Calculator));
