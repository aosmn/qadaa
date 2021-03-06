import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { Button } from 'react-bootstrap';
const CircularComponent = ({
  percent,
  total,
  totalMadeup,
  totalRemaining,
  onEdit,
  editText = 'Edit',
  isFinished,
  finishedText
}) => {
  return (
    <>
      <div className='d-flex flex-column justify-content-center mt-5'>
        <CircularProgressbar
          className='mx-auto d-flex justify-content-center align-items-center'
          value={percent}
          styles={{
            root: { width: '40%' },
            path: {
              // Path color
              stroke: `#fffa`
            },
            trail: {
              // Trail color
              stroke: '#fff4'
            },
            text: {
              fill: '#f88',
              textAlign: 'center',
              width: '100%'
              // fontWeight: 600
            }
          }}
        />
        <div className='circular-progress-text text-center'>
          <div className='percent'>{`${percent}%`}</div>
          <div className=''>Overall Progress</div>
        </div>
      </div>
      <div className='d-flex text-dark flex-column justify-content-center'>
        <div className='mt-4 p-0 d-flex justify-content-center'>
          <div className='font-weight-bold mx-2'>{totalMadeup}</div>
          out of
          <div className='font-weight-bold mx-2'>{total}</div>
          <br />
        </div>
        <div className='d-flex flex-column mx-auto align-items-center'>
          {isFinished ? (
            <b>{finishedText}</b>
          ) : (
            <small className='very-small-text'>
              Remaining <b className='px-2'>{totalRemaining}</b> prayers
            </small>
          )}
          <Button
            variant='link'
            className='p-0 very-small-text'
            style={{ color: 'rgb(255, 136, 136)' }}
            onClick={onEdit}>
            <b>{editText}</b>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CircularComponent;
