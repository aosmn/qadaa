import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getCalculationMethods } from '../api/prayerTimes.api';

const CalculationMethod = ({ onSubmit }) => {
  const { t } = useTranslation(['home']);
  const [methods, setMethods] = useState([]);
  const [method, setMethod] = useState(0);
  useEffect(() => {
    setMethod(localStorage.getItem('calculationMethod'));
    getCalculationMethods().then(res => {
      console.log(res);
      const methodsList = [];
      Object.keys(res.methods).forEach(r => {
        let op = res.methods[r];
        // console.log(op);
        let option = (
          <option key={op.id} value={op.id}>
            {op.name}
          </option>
        );
        methodsList.push(option);
      });
      setMethods(methodsList);
      // console.log(methodsList);
    });
    // axios.get('http://api.aladhan.com/v1/methods')
  }, []);

  // let methodList = (methods.length > 0 && methods.map(m => {
  //   console.log(m);
  //   return <div className=''>{m.name}</div>
  //   // <option value={m.id}>{m.id}</option>

  //   })) || [];
  const submitHandler = () => {
    localStorage.setItem('calculationMethod', method);
    onSubmit();
  };
  return (
    <div className='w-100'>
      <Form.Group controlId='save' className='w-100'>
        <label htmlFor='method'>Calculation Method</label>
        <select
          id='method'
          className='custom-select'
          aria-label='.form-select-lg example'
          onChange={e => setMethod(e.target.value)}
          value={method}>
          {methods}
        </select>
      </Form.Group>
      <Form.Group controlId='save' className='w-100'>
        <Button
          className='w-100 saveSettings'
          type='button'
          variant='primary'
          onClick={submitHandler}>
          {t('save')}
        </Button>
      </Form.Group>
    </div>
  );
  // (
  // );
};

export default CalculationMethod;
