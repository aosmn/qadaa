import React, { useState } from 'react';
import Calendar from '../../components/Prayers/Calendar';
import PrayersInput from '../../components/Prayers/PrayersInput';
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Button
} from 'react-bootstrap';

const LogsScreen = props => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const [dailyTarget] = useState(
    props.userInfo?.user?.preferences?.dailyTarget || 2
  );

  const selectDate = selected => {
    setSelectedDate(selected);
  };
  return (
    <Container className='h-100'>
      <Row className='h-100'>
        <Col sm={12} lg={12}>
          <Row className='d-flex align-items-center mt-4'>
            <Col className='h-100' sm={12} md={6} lg={5}>
              <Card className='h-100' style={{ minHeight: '317px' }}>
                <Card.Body>
                  <div className='h-100 progress-container'>
                    <Calendar onSelect={selectDate} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col className='h-100' sm={12} md={6} lg={7}>
              {!selectedDate ? (
                <Card className='h-100'>
                  <Card.Body className='h-100 d-flex align-items-center justify-content-center'>
                    <div className='h-100 progress-container text-center'>
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

export default LogsScreen;
