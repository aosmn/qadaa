import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

function ChangeLanguage({ changeLanguage, className = '' }) {
  const { t, i18n } = useTranslation(['home']);
  const lan = i18n.language;

  useEffect(() => {
    dayjs.locale(lan)
  }, [lan])
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
      <span className={`mx-2 ${lan==='en' ? 'ar-font' : 'en-font'}`}>{t('language')}</span>
      {/* <GlobalOutlined className={lan === 'en' ? 'ml-2' : 'mr-2'} /> */}
    </button>
  );
}

export default ChangeLanguage;
