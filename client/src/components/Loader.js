import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
const Loader = () => {
  const { t } = useTranslation(['home']);
  return (
    <div className='d-flex flex-column'>
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
      ></Spinner>
      <span className='sr-only mt-3'>{t('loading')}...</span>
    </div>
  );
};

export const LoadingOverlay = () => {
  const { t } = useTranslation(['home']);

  return (
    <div className='loading-overlay'>
      <Spinner animation='grow' size='sm' role='status'></Spinner>
      <span className='sr-only mt-3'>{t('loading')}...</span>
    </div>
  );
};

export default Loader;
