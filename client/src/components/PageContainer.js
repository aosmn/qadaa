import React from 'react';
import { Container } from 'react-bootstrap';

const PageContainer = ({ children }) => {
  return <Container className='h-100 pt-5 p-3'>{children}</Container>;
};

export default PageContainer;
