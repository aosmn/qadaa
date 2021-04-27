import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import { register } from '../../redux/actions/userActions';
import PasswordInput from '../../components/PasswordInput';
import Swipe from '../../components/SwipeComponent';
// TODO add react form hook
const RegisterScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isFemale, setIsFemale] = useState(true);

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
    dispatch(register(name, email, password, isFemale));
  };

  return (
    <FormContainer
      loading={loading}
      error={error}
      submit={submitHandler}
      submitButtonText='Register'
      linkButton={{
        to: redirect ? `/login?redirect=${redirect}` : '/login',
        text: 'Already have an account? Login'
      }}>
      <Form.Group controlId='name'>
        <Form.Control
          required
          type='name'
          placeholder='Enter name'
          value={name}
          onChange={e => setName(e.target.value)}></Form.Control>
        <Form.Label>Name</Form.Label>
      </Form.Group>
      <Form.Group controlId='email' className='mb-0'>
        <Form.Control
          required
          type='email'
          placeholder='Enter Email'
          value={email}
          onChange={e => setEmail(e.target.value)}></Form.Control>
        <Form.Label>Email</Form.Label>
      </Form.Group>
      <Swipe
        checkedText='Female'
        unCheckedText='Male'
        value={isFemale}
        onChange={v => setIsFemale(v)}
      />
      <PasswordInput
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    </FormContainer>
  );
};

export default RegisterScreen;
