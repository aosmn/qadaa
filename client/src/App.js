import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
// import Home from './screens/Authentication/HomeScreen';
import Login from './screens/Authentication/LoginScreen';
import ResetPassword from './screens/Authentication/ResetPasswordScreen';
import ForgotPassword from './screens/Authentication/ForgotPasswordScreen';
import Register from './screens/Authentication/RegisterScreen';
import LogPrayers from './screens/Prayers/PrayersCounter';
import PrayerLogs from './screens/PrayerLogs/PrayerLogs';
import './App.scss';
function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/reset-password' component={ResetPassword} />
          <Route path='/forgot-password' component={ForgotPassword} />

          <Route exact path='/' component={LogPrayers} />
          <Route exact path='/logs' component={PrayerLogs} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
