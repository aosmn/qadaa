import React, { useEffect } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions/userActions';
import { setAxiosAuth } from '../api/axiosRequest';
import { useHistory, useLocation } from 'react-router-dom';
import logo from '../assets/logo-grad-n.svg';
import { useTranslation } from 'react-i18next';
import Language from './ChangeLanguage';
const Header = ({ changeLanguage }) => {
  const { t } = useTranslation(['auth']);
  const userInfo = useSelector(state => state.userInfo);
  const { user } = userInfo;
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    if (localStorage.getItem('user')) {
      setAxiosAuth('Bearer ' + JSON.parse(localStorage.getItem('user')).token);
    }
  }, []);
  const logoutHandler = () => {
    dispatch(logout());
    history.push('/login');
  };
  const isLandingPage = () => {
    return location.pathname === '/about';
  };
  return (
    <header>
      <Navbar
        bg='light'
        variant='light'
        collapseOnSelect
        className={isLandingPage() ? 'landing-header' : ''}>
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
              <Nav.Link onClick={logoutHandler}>{t('logout')}</Nav.Link>
            ) : (
              <LinkContainer to='/login'>
                <Nav.Link>{t('loginBtn')}</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          {/* </Navbar.Collapse> */}
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
