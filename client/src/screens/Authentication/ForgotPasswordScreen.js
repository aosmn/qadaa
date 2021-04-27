import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import {
  sendRecoverEmail,
  clearPasswordState
} from '../../redux/actions/userActions';

const ForgotPasswordScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const passwordReset = useSelector(state => state.passwordReset);

  const { loading, error, message } = passwordReset;

  const redirect = location.search ? location.search.split('=')[1] : '/';
  useEffect(() => {
    return () => {
      dispatch(clearPasswordState);
    };
  }, [dispatch]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(sendRecoverEmail(email));
  };

  return (
    <FormContainer
      title='Forgot Password'
      loading={loading}
      error={error}
      message={message}
      submit={submitHandler}
      submitButtonText='Reset Password'
      linkButton={{
        to: redirect ? `/login?redirect=${redirect}` : '/login',
        text: 'Cancel'
      }}>
      <Form.Group controlId='email'>
        <Form.Control
          type='email'
          placeholder='Enter Email'
          value={email}
          onChange={e => setEmail(e.target.value)}></Form.Control>
        <Form.Label>Email</Form.Label>
      </Form.Group>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
