import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import { login } from '../../redux/actions/userActions';
import { useForm } from 'react-hook-form';

const LoginScreen = ({ location, history }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

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
    dispatch(login(data.email, data.password));
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
      submitButtonText='Sign In'
      linkButton={{
        to: redirect ? `/register?redirect=${redirect}` : '/register',
        text: 'Register'
      }}>
      <Form.Group controlId='email' className='mb-4'>
        <Form.Control
          {...register('email', { required: 'Email required' })}
          type='email'
          placeholder='Enter Email'
          isInvalid={errors.email}></Form.Control>
        <Form.Label>Email</Form.Label>
        <Form.Control.Feedback type='invalid'>
          {errors.email && errors.email.message}
        </Form.Control.Feedback>
      </Form.Group>
      <div className='d-flex flex-column mb-4 password-container'>
        <Form.Group controlId='password' className='mb-4'>
          <Form.Control
            {...register('password', { required: 'Password required' })}
            type='password'
            placeholder='Enter Password'
            isInvalid={errors.password}></Form.Control>
          <Form.Label>Password</Form.Label>

          <Form.Control.Feedback type='invalid'>
            {errors.password && errors.password.message}
          </Form.Control.Feedback>
          <small className='input-action ml-auto mt-1 mr-0 mb-2 password-reset-link'>
            <Link to='/forgot-password' className='text-secondary'>
              Forgot your password?
            </Link>
          </small>
        </Form.Group>
      </div>
    </FormContainer>
  );
};

export default LoginScreen;
