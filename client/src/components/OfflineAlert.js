import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import useNetwork from '../utils/useNetwork';

import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const OfflineAlert = () => {
  const { t } = useTranslation(['home']);
  const isOnline = useNetwork();
  // const [offline, setOffline] = useState(false);
  const location = useLocation();
  const isAuthRoute = () => {
    return (
      location.pathname === '/reset-password' ||
      location.pathname === '/forgot-password' ||
      location.pathname === '/register' ||
      location.pathname === '/login'
    );
  };

  return (
  !isAuthRoute() && !isOnline && (
      <Container fluid className='p-0'>
        <Alert variant='secondary' className='w-100 offline-alert py-1'>
          {t('offline')}
        </Alert>
      </Container>
    )
  );
};

export default OfflineAlert;
