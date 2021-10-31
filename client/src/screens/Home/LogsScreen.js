import React, { useState } from 'react';
import Calendar from '../../components/Prayers/Calendar';
import PrayersInput from '../../components/Prayers/PrayersInput';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/PageContainer';

const LogsScreen = props => {
  const { t, i18n } = useTranslation(['home']);
  const [selectedDate, setSelectedDate] = useState(null);

  const selectDate = selected => {
    setSelectedDate(selected);
  };
  return (
    <PageContainer>
      <Container className='h-100'>
        <Row className='h-100'>
          <Col sm={12} lg={12}>
            <Row className='d-flex align-items-center mt-4'>
              <Col className='h-100' sm={12} md={6} lg={5}>
                <h5>
                  <LinkContainer to='/'>
                    <Button
                      variant='link-light'
                      className={`p-0 ${
                        i18n.language.indexOf('ar') > -1 ? 'ml-4' : 'mr-4'
                      }`}>
                      {i18n.language.indexOf('ar') > -1 ? (
                        <ion-icon name='chevron-forward-outline'></ion-icon>
                      ) : (
                        <ion-icon name='chevron-back-outline'></ion-icon>
                      )}
                    </Button>
                  </LinkContainer>
                  {t('calendar')}
                </h5>
                <Card className='h-100 mt-4' style={{ minHeight: '317px' }}>
                  <Card.Body>
                    <div className='h-100 progress-container'>
                      <Calendar onSelect={selectDate} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col className='h-100 mt-4' sm={12} md={6} lg={7}>
                {!selectedDate ? (
                  <Card className='h-100'>
                    <Card.Body className='h-100 d-flex align-items-center justify-content-center'>
                      <div className='h-100 progress-container text-center'>
                        {t('selectDate')}
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
    </PageContainer>
  );
};

export default LogsScreen;
