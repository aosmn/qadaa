import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import {
  resetPassword,
  clearPasswordState
} from '../../redux/actions/userActions';
import parseQuery from '../../utils/parseQueryParams';
import { validPassword } from '../../utils/utils';
import { useForm } from 'react-hook-form';
import PasswordInput from '../../components/PasswordInput';
import { toast } from 'react-toastify';

const ResetPasswordScreen = ({ location, history }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  // const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const passwordReset = useSelector(state => state.passwordReset);
  const [submitted, setSubmitted] = useState(false);
  const { loading, error, message } = passwordReset;

  const query = location.search ? parseQuery(location.search) : {};
  const { token, email } = query;

  useEffect(() => {
    if (query && (!token || !email)) history.push('/');
    // if (message) {
    //   // setPassword('');
    // }
    return () => {
      dispatch(clearPasswordState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, token, email, dispatch, message]);

  useEffect(() => {
    if (submitted && message) {
      toast.success(message, {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined
      });
      history.push('/');
    }
  }, [submitted, message, history]);

  const onSubmit = data => {
    const { password } = data;
    // dispatch(registerUser(name, email, password, isFemale));
    dispatch(resetPassword(token, email, password)).then(() => {
      setSubmitted(true)
    });
  };

  const submitHandler = e => {
    e.preventDefault();
    handleSubmit(onSubmit)();
  };

  // const submitHandler = e => {
  //   e.preventDefault();
  //   dispatch(resetPassword(token, email, password));
  // };

  return (
    <FormContainer
      title='Reset Password'
      loading={loading}
      hasSeparator
      error={submitted && error}
      message={submitted && message}
      submit={submitHandler}
      submitButtonText='Reset Password'
      linkButton={{
        to: '/login',
        text: 'Cancel'
      }}>
      <PasswordInput
        {...register('password', {
          required: 'Please enter your password',
          validate: value => {
            return (
              validPassword(value) ||
              'Password must contain at least 1 letter, 1 number & must be > 6 characters'
            );
          }
        })}
        isInvalid={errors.password}
      />
      {/* <Form.Group controlId='password'>
        <Form.Control
          type='password'
          placeholder='Enter New Password'
          value={password}
          onChange={e => setPassword(e.target.value)}></Form.Control>
        <Form.Label>Password</Form.Label>
      </Form.Group> */}
      {/* <Form.Group controlId='confirmPassword'>
        <Form.Control
          type='password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}></Form.Control>
        <Form.Label>Confirm Password</Form.Label>
      </Form.Group> */}
    </FormContainer>
  );
};

export default ResetPasswordScreen;
