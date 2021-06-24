import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import FormContainer from '../../components/FormContainer';
import { register as registerUser } from '../../redux/actions/userActions';
import PasswordInput from '../../components/PasswordInput';
import Swipe from '../../components/SwipeComponent';
import { validPassword } from '../../utils/utils';

const RegisterScreen = ({ location, history }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

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

  const onSubmit = data => {
    const { name, email, password } = data;
    dispatch(registerUser(name, email, password, isFemale));
  };

  const submitHandler = e => {
    e.preventDefault();
    handleSubmit(onSubmit)();
  };

  return (
    <FormContainer
      loading={loading}
      error={error}
      submit={submitHandler}
      // title='Create an Account'
      // hasSeparator
      submitButtonText='Register'
      linkButton={{
        to: redirect ? `/login?redirect=${redirect}` : '/login',
        text: 'Already have an account? Login'
      }}>
      <Form.Group controlId='name' className='mb-4'>
        <Form.Control
          type='text'
          placeholder='Enter name'
          {...register('name', { required: 'Please enter your name' })}
          isInvalid={errors.name}
        />
        <Form.Label>Name</Form.Label>
        <Form.Control.Feedback type='invalid'>
          {errors.name && errors.name.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId='email' className='mb-3'>
        <Form.Control
          type='email'
          placeholder='Enter Email'
          {...register('email', { required: 'Please enter your email' })}
          isInvalid={errors.email}
        />
        <Form.Label>Email</Form.Label>
        <Form.Control.Feedback type='invalid'>
          {errors.email && errors.email.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Swipe
        checkedText='Female'
        unCheckedText='Male'
        value={isFemale}
        onChange={v => setIsFemale(v)}
      />
      <PasswordInput
        {...register('password', {
          required: 'Please enter your password',
          validate: value => {
            return validPassword(value) || 'Password must contain at least 1 letter, 1 number & must be > 6 characters';
          }
        })}
        isInvalid={errors.password}
      />
    </FormContainer>
  );
};

export default RegisterScreen;
