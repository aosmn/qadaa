import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import {
  resetPassword,
  clearPasswordState
} from '../../redux/actions/userActions';
import parseQuery from '../../utils/parseQueryParams';

const ResetPasswordScreen = ({ location, history }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();
  const passwordReset = useSelector(state => state.passwordReset);

  const { loading, error, message } = passwordReset;

  const query = location.search ? parseQuery(location.search) : {};
  const { token, email } = query;

  useEffect(() => {
    if (query && (!token || !email)) history.push('/');
    if (message) {
      setPassword('');
      setConfirmPassword('');
    }
    return () => {
      dispatch(clearPasswordState);
    };
  }, [history, token, email, dispatch, message]);

  const submitHandler = e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passowrds don't match");
    } else {
      setPasswordError('');
      dispatch(resetPassword(token, email, password));
    }
  };

  return (
    <FormContainer
      title='Reset Password'
      loading={loading}
      error={error}
      message={message}
      submit={submitHandler}
      submitButtonText='Reset Password'
      linkButton={{
        to: '/login',
        text: 'Cancel'
      }}>
      <Form.Group controlId='password'>
        <Form.Control
          type='password'
          placeholder='Enter Password'
          value={password}
          onChange={e => setPassword(e.target.value)}></Form.Control>
        <Form.Label>Password</Form.Label>
      </Form.Group>
      <Form.Group controlId='confirmPassword'>
        <Form.Control
          type='password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}></Form.Control>
        <Form.Label>Confirm Password</Form.Label>
      </Form.Group>
    </FormContainer>
  );
};

export default ResetPasswordScreen;
