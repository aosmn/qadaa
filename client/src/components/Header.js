import React, { useEffect } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions/userActions';
import { setAxiosAuth } from '../api/axiosRequest';
import { useHistory } from 'react-router-dom';
import logo from '../assets/logo-grad.svg';

const Header = () => {
  const userInfo = useSelector(state => state.userInfo);
  const { user } = userInfo;
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    if (localStorage.getItem('user')) {
      setAxiosAuth('Bearer ' + JSON.parse(localStorage.getItem('user')).token);
    }
  }, []);
  const logoutHandler = () => {
    dispatch(logout());
    history.push('/login');
  };
  return (
    <header>
      <Navbar bg='dark' variant='dark' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img
                src={logo}
                width='30'
                height='36.25'
                alt=''
                className='mr-4 logo'
              />
              Qadaa'
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ml-auto'>
              {user ? (
                <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>Sign In</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
