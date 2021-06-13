import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import useNetwork from '../utils/useNetwork';

import { useLocation } from 'react-router-dom';

const OfflineAlert = () => {
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
          You are offline, changes you make will be added when you go online.
        </Alert>
      </Container>
    )
  );
};

export default OfflineAlert;
