import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import FormContainer from '../../components/FormContainer';
import { register as registerUser } from '../../redux/actions/userActions';
import PasswordInput from '../../components/PasswordInput';
import Swipe from '../../components/SwipeComponent';
import { validPassword } from '../../utils/utils';
import { useTranslation } from 'react-i18next';
const RegisterScreen = ({ location, history }) => {
  const { t } = useTranslation(['auth']);
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
      submitButtonText={t('register.register')}
      linkButton={{
        to: redirect ? `/login?redirect=${redirect}` : '/login',
        text: t('register.login')
      }}>
      <Form.Group controlId='name' className='mb-4'>
        <Form.Control
          type='text'
          placeholder={t('inputFields.name.placeholder')}
          {...register('name', { required: t('inputFields.name.required') })}
          isInvalid={errors.name}
        />
        <Form.Label>{t('inputFields.name.label')}</Form.Label>
        <Form.Control.Feedback type='invalid'>
          {errors.name && errors.name.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId='email' className='mb-3'>
        <Form.Control
          type='email'
          placeholder={t('inputFields.email.placeholder')}
          {...register('email', { required: t('inputFields.email.required') })}
          isInvalid={errors.email}
        />
        <Form.Label>{t('inputFields.email.label')}</Form.Label>
        <Form.Control.Feedback type='invalid'>
          {errors.email && errors.email.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Swipe
        checkedText={t('register.female')}
        unCheckedText={t('register.male')}
        value={isFemale}
        onChange={v => setIsFemale(v)}
      />
      <PasswordInput
        {...register('password', {
          required: t('inputFields.password.required'),
          validate: value => {
            return validPassword(value) || t('inputFields.password.invalid');
          }
        })}
        isInvalid={errors.password}
      />
    </FormContainer>
  );
};

export default RegisterScreen;
