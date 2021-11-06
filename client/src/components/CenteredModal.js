import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const VerticallyCenteredModal = props => {
  const { i18n } = useTranslation(['landing']);
  return (
    <Modal
      {...props}
      className={i18n.language}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered>
      <Modal.Header className='align-items-center' closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          {props.item.title}
          <a
            target='_blank'
            rel='noreferrer'
            href={props.item.url}
            className='p-0 ms-3 btn btn-link text-primary'>
             ({props.item.src})
            <small className='ms-2'>
              <ion-icon
                className='text-secondary'
                name='open-outline'></ion-icon>{' '}
            </small>
          </a>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{props.item.question}</h4>
        <p>{props.item.description}</p>
      </Modal.Body>
    </Modal>
  );
};

export default VerticallyCenteredModal;
