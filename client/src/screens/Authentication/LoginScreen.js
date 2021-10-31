import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, FloatingLabel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import { login } from '../../redux/actions/userActions';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const LoginScreen = ({ location, history }) => {
  const { t } = useTranslation(['auth']);
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
      submitButtonText={t('login.login')}
      linkButton={{
        to: redirect ? `/register?redirect=${redirect}` : '/register',
        text: t('login.register')
      }}>
      <FloatingLabel
        className='mt-3'
        controlId='email'
        label={t('inputFields.email.label')}>
        <Form.Control
          {...register('email', {
            required: t('inputFields.email.required')
          })}
          type='email'
          placeholder={t('inputFields.email.label')}
          isInvalid={errors.email}
        />
        <Form.Control.Feedback type='invalid'>
          {errors.email && errors.email.message}
        </Form.Control.Feedback>
      </FloatingLabel>
      <div className='d-flex flex-column mb-4 password-container'>
        <Form.Group controlId='password' className='mb-4 password-container'>
          <FloatingLabel
            controlId='password'
            label={t('inputFields.password.label')}>
            <Form.Control
              {...register('password', {
                required: t('inputFields.password.required')
              })}
              type='password'
              placeholder={t('inputFields.password.label')}
              isInvalid={errors.password}
            />
            <Form.Control.Feedback type='invalid'>
              {errors.password && errors.password.message}
            </Form.Control.Feedback>
          </FloatingLabel>
          {/* <Form.Control
            {...register('password', {
              required: t('inputFields.password.required')
            })}
            type='password'
            placeholder={t('inputFields.password.placeholder')}
            isInvalid={errors.password}></Form.Control>
          <Form.Label>{t('inputFields.password.label')}</Form.Label>

          <Form.Control.Feedback type='invalid'>
            {errors.password && errors.password.message}
          </Form.Control.Feedback> */}
          <small className='input-action ml-auto mt-1 mr-0 mb-2 password-reset-link'>
            <Link to='/forgot-password' className='text-secondary'>
              {t('login.forgot')}
            </Link>
          </small>
        </Form.Group>
      </div>
    </FormContainer>
  );
};

export default LoginScreen;
