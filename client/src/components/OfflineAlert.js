import React, { useEffect, useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import isOnline from 'is-online';

import { useLocation } from 'react-router-dom';

const OfflineAlert = () => {
  const [offline, setOffline] = useState(false);
  const location = useLocation();
  useEffect(() => {
    (async () => {
      setOffline(!(await isOnline()));
    })();
    window.addEventListener('offline', function (e) {
      setOffline(true);
    });

    window.addEventListener('online', function (e) {
      setOffline(false);
    });
  }, []);
  const isAuthRoute = () => {
    return (
      location.pathname === '/reset-password' ||
      location.pathname === '/forgot-password' ||
      location.pathname === '/register' ||
      location.pathname === '/login'
    );
  };

  return (
  !isAuthRoute() && offline && (
      <Container fluid className='p-0'>
        <Alert variant='secondary' className='w-100 offline-alert py-1'>
          You are offline, changes you make will be added when you go online.
        </Alert>
      </Container>
    )
  );
};

export default OfflineAlert;
