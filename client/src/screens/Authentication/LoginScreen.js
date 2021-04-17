import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import { login } from '../../redux/actions/userActions';

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.userInfo);

  const { loading, error, user } = userInfo;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (user) {
      history.push(redirect);
    }
  }, [history, user, redirect]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <FormContainer
      loading={loading}
      error={error}
      submit={submitHandler}
      submitButtonText='Sign In'
      linkButton={{
        to: redirect ? `/register?redirect=${redirect}` : '/register',
        text: 'Register'
      }}>
      <Form.Group controlId='email'>
        <Form.Control
          type='email'
          placeholder='Enter Email'
          value={email}
          onChange={e => setEmail(e.target.value)}></Form.Control>
        <Form.Label>Email</Form.Label>
      </Form.Group>
      <div className='d-flex flex-column'>
        <Form.Group controlId='password' className='d-flex flex-column mb-0'>
          <Form.Control
            type='password'
            placeholder='Enter Password'
            value={password}
            onChange={e => setPassword(e.target.value)}></Form.Control>
          <Form.Label>Password</Form.Label>
        </Form.Group>
        <small className='input-action ml-auto mt-1 mr-2 mb-2'>
          <Link to='/forgot-password' className='text-secondary'>
            Forgot your password?
          </Link>
        </small>
      </div>
    </FormContainer>
  );
};

export default LoginScreen;
