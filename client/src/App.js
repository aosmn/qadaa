import React, { useEffect, useState } from 'react';
import { setAxiosAuth } from './api/axiosRequest';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './ProtectedRoute';
import Home from './screens/Home';
import Logs from './screens/Home/LogsScreen';
import Login from './screens/Authentication/LoginScreen';
import ResetPassword from './screens/Authentication/ResetPasswordScreen';
import ForgotPassword from './screens/Authentication/ForgotPasswordScreen';
import Register from './screens/Authentication/RegisterScreen';
import { connect } from 'react-redux';
import day from 'dayjs';
// import LogPrayers from './screens/Prayers/PrayersCounter';
// import PrayerLogs from './screens/PrayerLogs/PrayerLogs';
// import Calculator from './screens/Preferences/Calculator';
import Joyride, { STATUS } from 'react-joyride';
import {
  updateUserPreferences,
  setJoyrideNext,
  getMe
} from './redux/actions/userActions';

import { getOfflineDayLogs, deleteDayLogsByDay } from './services/DBHelper';

import { saveOfflineLogs } from './redux/actions/prayerActions.js';

import './App.scss';

const mapStateToProps = state => ({
  prayerTotals: state.prayerTotals,
  today: state.prayerLogs.today?.total || 0,
  userInfo: state.userInfo,
  joyride: state.joyride
});

const mapDispatchToProps = dispatch => ({
  updatePreferences: prefs => dispatch(updateUserPreferences(prefs)),
  setJoyrideNext: next => dispatch(setJoyrideNext(next)),
  getMe: () => dispatch(getMe()),
  saveOfflineLogs: log => dispatch(saveOfflineLogs(log))
});

const App = props => {
  const [offline, setOffline] = useState(false);
  // console.log(window.navigator.isOnline);
  useEffect(() => {
    setOffline(window.navigator.isOnline);
  }, []);
  const counterSteps = [
    {
      target: '.addPrayer',
      content: `Let's try and add a prayer here`
    },
    {
      target: '.addManyPrayers',
      content: `You can also add many prayers, Let's try`
    },
    {
      target: '.manyPrayersCount',
      content: `Enter how many prayers did you make up`
    },
    {
      target: '.saveManyPrayers',
      content: `Let's add them`
    },
    {
      target: '.prayersCount',
      content: `They will be added here`
    },
    {
      target: '.addDay',
      content: `You can add the five prayers for one day, Let's try`
    },
    {
      target: '.counter',
      content: `This will add 1 to every prayer's counter`
    },
    {
      target: '.addDay',
      content: `You can also add the five prayers for many days, Please press and hold the button`
    },
    {
      target: '.counter',
      content: `This will add to every prayer's counter`
    }
    // {
    //   target: '.closeOverlay',
    //   content: `You can cancel here`
    // }
  ];
  const calendarSteps = [
    { target: '.logs', content: `You can see your logs here` },
    { target: '.calendar', content: `You can see your logs here` },
    {
      target: '.count',
      content: `This  is the number of prayers you made up that day, Click to see details`
    },
    {
      target: '.dayDetails',
      content: `You can view and edit the day prayers here`
    }
  ];
  const settingsSteps = [
    {
      target: '.settings',
      content: `Let's setup your profile to calculate the number of prayers you missed`
    },
    {
      target: '.startDate',
      content: `Start date is the start of the period you want to make up for. Select it now`
    },
    {
      target: '.endDate',
      content: `End date is the end of the period you want to make up for. Select it now`
    },
    {
      target: '.isFemale',
      content: `Please select your gender`
    },
    {
      target: '.period',
      content: `Your period days aren't added in the total days you need to make up for`
    },
    {
      target: '.dailyTarget',
      content: `Set a daily target to make up prayers every day`
    },
    {
      target: '.saveSettings',
      content: `Let's save your settings and start making up prayers`
    }
  ];
  const steps = [
    {
      target: '.logo',
      content:
        'Welcome to Qadaa! Your companion to make up and count the prayers you have missed. May Allah accept from us all!'
    },
    {
      target: '.home',
      content: 'This is your home page!',
      placement: 'center'
    },
    ...settingsSteps,
    {
      target: '.personal',
      content: `This is your profile, you can see our daily progress, overall progress and your settings here`
    },
    {
      target: '.counter',
      content: `This is your counter, you can add or subtract prayers you make up here`
    },
    ...counterSteps,
    ...calendarSteps
  ];
  useEffect(() => {
    if (localStorage.getItem('user')) {
      // console.log('henaaa');
      setAxiosAuth('Bearer ' + JSON.parse(localStorage.getItem('user')).token);
      props.getMe();
    }

    window.addEventListener('offline', function (e) {
      setOffline(true);
    });

    window.addEventListener('online', function (e) {
      setOffline(false);
      getOfflineDayLogs().then(res => {
        console.log(res);
        res.forEach(offlineDay => {
          props
            .saveOfflineLogs({
              day: day(offlineDay.day),
              prayers: {
                fajr: offlineDay.fajr || 0,
                dhuhr: offlineDay.dhuhr || 0,
                asr: offlineDay.asr || 0,
                maghrib: offlineDay.maghrib || 0,
                isha: offlineDay.isha || 0
              }
            })
            .then(res => {
              if (res) {
                deleteDayLogsByDay(offlineDay.id);
              } else {
                // TODO: Alert
                console.log('error uploading offline logs');
              }
            });
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJoyrideCallback = data => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      // this.setState({ run: false });
      // window.localStorage.setItem('tutorialDone', true)
      props.updatePreferences({ tutorialDone: true });
    }
  };
  return (
    <div className='h-100 d-flex flex-column'>
      <Router>
        <Header />
        {offline && (
          <Container fluid className='p-0'>
            <Alert variant='secondary' className='w-100 offline-alert py-1'>
              You are offline, changes you make will be added when you go
              online.
            </Alert>
          </Container>
        )}
        <main className='flex-grow-1 d-flex align-items-center'>
          <Container className='h-100 pt-5 p-3'>
            {props.userInfo?.user &&
              !props.userInfo?.user?.preferences?.tutorialDone && (
                <Joyride
                  steps={steps}
                  continuous={true}
                  disableOverlayClose={true}
                  // showProgress={true}
                  showSkipButton={true}
                  callback={handleJoyrideCallback}
                  spotlightClicks={true}
                  showProgress={false}
                  getHelpers={({ next }) => {
                    props.setJoyrideNext(next);
                  }}
                />
              )}
            <Route exact path='/reset-password' component={ResetPassword} />
            <Route exact path='/forgot-password' component={ForgotPassword} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />

            <ProtectedRoute exact path='/logs' component={Logs} />
            <ProtectedRoute exact path='/' component={Home} />
          </Container>
        </main>
        <Footer />
      </Router>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
