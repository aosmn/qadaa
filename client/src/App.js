import React, { useEffect } from 'react';
import { setAxiosAuth } from './api/axiosRequest';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './ProtectedRoute';
import Home from './screens/Home';
import Logs from './screens/Home/LogsScreen';
import Login from './screens/Authentication/LoginScreen';
import ResetPassword from './screens/Authentication/ResetPasswordScreen';
import ForgotPassword from './screens/Authentication/ForgotPasswordScreen';
import Register from './screens/Authentication/RegisterScreen';
// import LogPrayers from './screens/Prayers/PrayersCounter';
// import PrayerLogs from './screens/PrayerLogs/PrayerLogs';
// import Calculator from './screens/Preferences/Calculator';
import './App.scss';
function App() {
  useEffect(() => {
    if (localStorage.getItem('user')) {
      setAxiosAuth('Bearer ' + JSON.parse(localStorage.getItem('user')).token);
    }
  }, []);
  return (
    <div className='h-100 d-flex flex-column'>
      <Router>
        <Header />
        <main className='flex-grow-1 d-flex align-items-center'>
          <Container className='h-100 pt-5 p-3'>
            <Route exact path='/reset-password' component={ResetPassword} />
            <Route exact path='/forgot-password' component={ForgotPassword} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />

            <ProtectedRoute exact path='/logs' component={Logs} />
            {/* <ProtectedRoute exact path='/calculate' component={Calculator} /> */}
            <ProtectedRoute exact path='/' component={Home} />
          </Container>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
