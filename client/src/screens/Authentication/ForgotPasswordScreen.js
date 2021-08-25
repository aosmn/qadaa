import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import {
  sendRecoverEmail,
  clearPasswordState
} from '../../redux/actions/userActions';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ForgotPasswordScreen = ({ location, history }) => {
  const { t } = useTranslation(['auth']);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
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
    dispatch(sendRecoverEmail(email)).then(() => {
      setSubmitted(true);
    });
  };

  useEffect(() => {
    if (submitted && message) {
      toast.success(t('forgotPassword.confirm'), {
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
  }, [submitted, message, history, t]);

  return (
    <FormContainer
      title={t('forgotPassword.title')}
      hasSeparator
      loading={loading}
      error={submitted && error}
      message={submitted && message}
      submit={submitHandler}
      submitButtonText={t('forgotPassword.resetPassword')}
      linkButton={{
        to: redirect ? `/login?redirect=${redirect}` : '/login',
        text: t('cancel')
      }}>
      <Form.Group controlId='email'>
        <Form.Control
          type='email'
          placeholder={t('inputFields.email.placeholder')}
          value={email}
          onChange={e => setEmail(e.target.value)}></Form.Control>
        <Form.Label>{t('inputFields.email.label')}</Form.Label>
      </Form.Group>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
