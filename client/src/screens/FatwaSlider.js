import React, { useState, useEffect } from 'react';
import { Carousel, Card, Button, Spinner } from 'react-bootstrap';
import { getFatwas } from '../api/fatwas.api';
import { useTranslation } from 'react-i18next';
import Modal from '../components/CenteredModal';

const FatwaSlider = () => {
  const [fatwas, setFatwas] = useState([]);
  const [fatwasLoading, setFatwasLoading] = useState(false);
  const { t, i18n } = useTranslation(['landing']);
  const [modalShow, setModalShow] = useState(false);
  // const [modalTitle, setModalTitle] = useState('');
  // const [modalDescription, setModalDescription] = useState('');
  // const [modalHeading, setModalHeading] = useState('');
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    setFatwasLoading(true);

    getFatwas(i18n.language).then(data => {
      setFatwasLoading(false);
      setFatwas(data);
    });
    return () => {
      setFatwasLoading(false);
    };
  }, [i18n.language]);
  const onClickItem = item => {
    // setModalDescription(item.description);
    // setModalTitle(item.title);
    setSelectedItem(item);
    setModalShow(true);
  };
  const fatwaItems =
    fatwas.length > 0 &&
    fatwas.map(fatwa => (
      <Carousel.Item key={fatwa._id} className='w-100'>
        <div className='item-container'>
          <Carousel.Caption className='h-100 d-flex justify-content-center align-items-center'>
            <Card>
              <Card.Body>
                <h5>
                  {fatwa.title}{' '}
                  <small className='text-secondary'>({fatwa.src})</small>
                </h5>
                <p className='f-description'>{fatwa.brief}</p>
                <Button
                  onClick={() => onClickItem(fatwa)}
                  variant='link'
                  className='p-0 text-secondary'>
                  {t('readMore')}
                </Button>
              </Card.Body>
            </Card>
          </Carousel.Caption>
        </div>
      </Carousel.Item>
    ));
  return fatwasLoading ? (
    <div className='d-flex align-items-center' style={{ minHeight: 300 }}>
      <Spinner animation='grow' variant='secondary' />
    </div>
  ) : (
    <>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        item={selectedItem}
      />
      <Carousel variant='dark' interval={20000} fade slide={false}>
        {fatwaItems}
      </Carousel>
    </>
  );
};

export default FatwaSlider;
