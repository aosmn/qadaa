import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const BackButton = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };
  return (
    <Button variant='link' onClick={goBack}>
      <ion-icon name='chevron-back-outline'></ion-icon>
    </Button>
  );
};

export default BackButton;
