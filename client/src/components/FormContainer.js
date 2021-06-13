import React from 'react';
import { Form, Container, Row, Col, Card, Button } from 'react-bootstrap';
import Message from '../components/Message';
import { LoadingOverlay } from '../components/Loader';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-grad-n.svg';

const FormContainer = ({
  children,
  hideLogo,
  title,
  error,
  loading,
  message,
  submit,
  submitButtonText,
  linkButton
}) => {
  return (
    <Container className='h-100'>
      <Row className='justify-content-md-center h-100'>
        <Col className='h-100 d-flex justify-content-center' xs={12} md={8}>
          <Card className='h-100 w-100' style={{ maxWidth: '600px' }}>
            {loading && <LoadingOverlay />}
            <Card.Body>
              <Col xs={{ span: 10, offset: 1 }} className='h-100'>
                <div className='d-flex flex-column h-100 mx-4'>
                  {!hideLogo && (
                    <div className='logo-container-vertical'>
                      <img
                        src={logo}
                        alt='logo'
                      />
                      <div className='logo-text'>Qadaa</div>
                    </div>
                  )}
                  {title && (
                    <h5 className='text-center text-secondary mb-4'>{title}</h5>
                  )}
                  {message && <Message variant='success'>{message}</Message>}
                  {error && <Message variant='danger'>{error}</Message>}

                  <Form
                    onSubmit={submit}
                    className='flex-grow-1 d-flex flex-column justify-content-between my-4'>
                    {children}

                    <Form.Group controlId='submit' className='w-100'>
                      <Button className='w-100' type='submit' variant='primary'>
                        {submitButtonText}
                      </Button>
                    </Form.Group>

                    {linkButton && (
                      <Form.Group
                        controlId='forgot'
                        className='w-100 d-flex justify-content-center'>
                        <Link className='text-secondary' to={linkButton.to}>
                          {linkButton.text}
                        </Link>
                      </Form.Group>
                    )}
                  </Form>
                </div>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
