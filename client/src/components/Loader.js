import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
const Loader = () => {
  const { t } = useTranslation(['home']);
  return (
    <Spinner
      animation='grow'
      size='sm'
      role='status'
      // style={{
      //   width: '100px',
      //   height: '100px',
      //   margin: 'auto',
      //   display: 'block'
      // }}
    >
      <span className='sr-only'>{t('loading')}...</span>
    </Spinner>
  );
};

export const LoadingOverlay = () => {
  const { t } = useTranslation(['home']);

  return (
    <div className='loading-overlay'>
      <Spinner animation='grow' size='sm' role='status'>
        <span className='sr-only'>{t('loading')}...</span>
      </Spinner>
    </div>
  );
};

export default Loader;
