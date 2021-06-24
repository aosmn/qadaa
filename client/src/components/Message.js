import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, children }) => {
  return <Alert className='p-4' variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  cariant: 'info'
};

export default Message;
