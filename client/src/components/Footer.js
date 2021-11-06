import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
const Footer = () => {
  const { t } = useTranslation('home');
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>{t('copyright')} &copy; <a href="mailto:alaa.osmana@gmail.com">aosmn</a> · 2021</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
