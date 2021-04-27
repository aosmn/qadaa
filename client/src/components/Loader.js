import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
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
      <span className='sr-only'>Loading...</span>
    </Spinner>
  );
};

export const LoadingOverlay = () => (
  <div className='loading-overlay'>
    <Spinner
      animation='grow'
      size='sm'
      role='status'
    >
      <span className='sr-only'>Loading...</span>
    </Spinner>
  </div>
);

export default Loader;
