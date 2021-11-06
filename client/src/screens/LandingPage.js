import React, { useState, useEffect } from 'react';
import '../styles/landing.scss';
import pattern from '../assets/pattern.svg';
import logo from '../assets/logo-white.svg';
import countImg from '../assets/screens/count.png';
import calendarImg from '../assets/screens/calendar.png';
import progressImg from '../assets/screens/progress.png';
import settingsImg from '../assets/screens/settings_c.png';
import prayerTimesImg from '../assets/screens/prayer_times.png';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import FatwaSlider from './FatwaSlider';

import { useSelector } from 'react-redux';
// import { logout } from '../redux/actions/userActions';
// import { setAxiosAuth } from '../api/axiosRequest';
// import { useHistory, } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Language from '../components/ChangeLanguage';

const LandingPage = ({ changeLanguage }) => {
  const { t } = useTranslation(['landing']);
  const userInfo = useSelector(state => state.userInfo);
  const { user } = userInfo;
  // const dispatch = useDispatch();
  // const history = useHistory();
  // const logoutHandler = () => {
  //   dispatch(logout());
  //   history.push('/login');
  // };
  const [collapse, setCollapse] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', event => {
      if (window.scrollY >= 135) {
        setCollapse(true);
      } else {
        setCollapse(false);
      }
    });
  }, []);
  return (
    <div className='landing h-100 w-100'>
      <div className={`cover${collapse ? ' collapsed' : ''}`}>
        <div className='title-container-background'>
          <img src={pattern} alt='' className='pattern right' />
          <img src={pattern} alt='' className='pattern left' />
        </div>
        <div className='title-container d-flex flex-column align-items-center w-100 justify-content-center'>
          <div className='cover-logo d-flex flex-row align-items-center'>
            <img
              src={logo}
              width='60'
              height='72.5'
              alt=''
              className='mx-3 logo'
            />
            <div className='logo-text large text-light'>{t('qadaa')}</div>
          </div>
          <div className='text-light text-center sub-title'>
            {t("subtitle")}
          </div>
        </div>
        <div className={`l-header top ${!collapse ? '' : 'd-none'} mt-2 me-5 pe-5`}>
            <Nav className='justify-content-end py-2'>
              <Language changeLanguage={changeLanguage} />
              {user ? (
                // <Nav.Link onClick={logoutHandler}>{t('logout')}</Nav.Link>
                <LinkContainer to='/'>
                  <Nav.Link>{t('goToApp')}</Nav.Link>
                </LinkContainer>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>{t('loginBtn')}</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
        </div>
        <Navbar
          bg='light'
          variant='light'
          collapseOnSelect
          className={`l-header ${collapse ? '' : 'd-none'}`}>
          <Container>
            <LinkContainer to='/'>
              <Navbar.Brand>
                <img
                  src={logo}
                  width='30'
                  height='36.25'
                  alt=''
                  className='mx-4 logo'
                />
                {t('qadaa')}
              </Navbar.Brand>
            </LinkContainer>
            {/* <Navbar.Toggle aria-controls='basic-navbar-nav' /> */}
            {/* <Navbar.Collapse id='basic-navbar-nav'> */}
            <Nav>
              <Language changeLanguage={changeLanguage} />
              {user ? (
                // <Nav.Link onClick={logoutHandler}>{t('logout')}</Nav.Link>
                <LinkContainer to='/'>
                  <Nav.Link>{t('goToApp')}</Nav.Link>
                </LinkContainer>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>{t('loginBtn')}</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
            {/* </Navbar.Collapse> */}
          </Container>
        </Navbar>
      </div>

      <div className={`content ${collapse ? 'content-collapsed-header' : ''}`}>
        <div className='section d-flex flex-column mt-2 align-items-center'>
          <div className='my-5'>
            <div className='quran d-flex flex-column mt-5 align-items-center text-secondary'>
              
                <p className='mb-2 ar-text'> بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ</p>
              <p className='mb-4 ar-text'>
                "إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي
                وَأَقِمِ الصَّلَاةَ لِذِكْرِي"
              </p>
              <p className='m-0'>
                "Indeed, I am Allah. There is no deity except Me, so worship Me
                and establish prayer for My remembrance"
              </p>
            </div>
          </div>
          <div className='w-100 px-5'>
            <hr className='w-100' />
          </div>
          <FatwaSlider />

          <div className='w-100 px-5'>
            <hr className='w-100' />
          </div>
          <div className='intro text-center m-5 mb-0'>
            <h2 className='title mb-4'>{t('title1')}</h2>
            <p className="mx-auto" style={{width: "70%"}}>{t('description1')}</p>
            <div className='mt-5'>
              <div className='feature'>
                <div className='text text-end'>
                  <span>{t('title2')} </span>
                  {t('description2')}.
                </div>
                <img src={countImg} alt='' />
              </div>
              <div className='feature left'>
                <div className='text text-start'>
                  <span>{t('title3')} </span>
                  {t('description3')}.
                </div>
                <img src={settingsImg} alt='' />
              </div>
              <div className='feature'>
                <div className='text text-end'>
                  <span>{t('title4')} </span>
                  {t('description4')}.
                </div>
                <img src={progressImg} alt='' />
              </div>
              <div className='feature left'>
                <div className='text text-start'>
                  <span>{t('title5')} </span>
                  {t('description5')}.
                </div>
                <img src={calendarImg} alt='' />
              </div>

              <div className='feature'>
                <div className='text text-end'>
                  <span>{t('title6')} </span>
                  {t('description6')}.
                </div>
                <img src={prayerTimesImg} alt='' />
              </div>
            </div>
          </div>
        </div>

        <div className='w-100 px-5'>
          <hr className='w-100' />
        </div>
        <div className='text-center m-5'>
          <Link className='btn btn-primary px-4' to='/register'>
            {t('registerBtn')}
          </Link>
          {/* <Button className='w-100' type='submit' variant='primary'>
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
