import React from 'react';
import { useTranslation } from 'react-i18next';

function ChangeLanguage({ changeLanguage, className = '' }) {
  const { t, i18n } = useTranslation(['home']);
  const lan = i18n.language;

  const setLanguage = code => {
    i18n.changeLanguage(code);
    changeLanguage(code);
  };
  return (
    <button
      className={`btn btn-link p-0 text-secondary d-flex align-items-center ${className} justify-content-start`}
      style={{ color: 'white' }}
      onClick={() => {
        setLanguage(lan === 'en' ? 'ar' : 'en');
      }}>
      <ion-icon name='earth-outline'></ion-icon>
      <span className='mx-2'>{t('language')}</span>
      {/* <GlobalOutlined className={lan === 'en' ? 'ml-2' : 'mr-2'} /> */}
    </button>
  );
}

export default ChangeLanguage;
