import React, { useEffect, useState } from 'react';
import { setAxiosAuth } from './api/axiosRequest';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// import withRouter from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './ProtectedRoute';
import Home from './screens/Home';
import LandingPage from './screens/LandingPage';
import Logs from './screens/Home/LogsScreen';
import Login from './screens/Authentication/LoginScreen';
import ResetPassword from './screens/Authentication/ResetPasswordScreen';
import ForgotPassword from './screens/Authentication/ForgotPasswordScreen';
import Register from './screens/Authentication/RegisterScreen';
import { connect } from 'react-redux';
import day from 'dayjs';
import Joyride, { STATUS } from 'react-joyride';
import Offline from './components/OfflineAlert';
import {
  updateUserPreferences,
  setJoyrideNext,
  getMe
} from './redux/actions/userActions';

import {
  getOfflineDayLogs,
  deleteDayLogsByDay,
  getOfflineHaderLogs,
  deleteHaderLogsByDay
} from './services/DBHelper';

import {
  saveOfflineLogs,
  getPrayerTotals
} from './redux/actions/prayerActions.js';

import {
  saveHaderOfflineLogs,
  // getPrayerTotals
} from './redux/actions/haderPrayerActions.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

import './locales/i18n';
import { useTranslation } from 'react-i18next';
import * as STEPS from './utils/tutorialSteps';

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
  saveOfflineLogs: log => dispatch(saveOfflineLogs(log)),
  saveHaderOfflineLogs: log => dispatch(saveHaderOfflineLogs(log)),
  getPrayerTotals: id => dispatch(getPrayerTotals(id))
});

const App = props => {
  const { t, i18n } = useTranslation(['tutorial']);
  const [language, setLanguage] = useState(i18n.language);
  const steps = [
    ...STEPS.introSteps,
    ...STEPS.settingsSteps,
    ...STEPS.counterSteps,
    ...STEPS.calendarSteps
  ];

  const onClickSync = user => {
    getOfflineDayLogs(user).then(res => {
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
              toast.error('error syncing offline logs', {
                position: 'top-right',
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
              });
            }
          });
      });
    });
  };
  const onClickDelete = user => {
    getOfflineDayLogs(user).then(res => {
      res.forEach(offlineDay => {
        deleteDayLogsByDay(offlineDay.id);
        props.getPrayerTotals(user);
      });
    });
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      // console.log('henaaa');
      setAxiosAuth('Bearer ' + JSON.parse(localStorage.getItem('user')).token);
      props.getMe();
    }
    const user = props.userInfo?.user?._id;

    window.addEventListener('load', () => {
      window.addEventListener('online', e => {
        // console.log(getOfflineDayLogs(user));
        getOfflineDayLogs(user).then(res => {
          if (res.length > 0) {
            const nDays = res.length;
            const Msg = ({ closeToast, toastProps }) => (
              <div>
                You have offline entries for {nDays} days, do you want to sync
                them online, or just delete them?
                <div className='mt-3'>
                  <button
                    className='btn btn-success py-2'
                    onClick={() => {
                      onClickSync(user);
                      closeToast();
                    }}>
                    Sync
                  </button>
                  <button
                    className='btn btn-danger py-2 mx-2'
                    onClick={() => {
                      onClickDelete(user);
                      closeToast();
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            );
            toast.info(Msg, {
              position: 'top-right',
              autoClose: false,
              hideProgressBar: false,
              closeOnClick: false,
              draggable: false,
              progress: undefined
            });
          }
        });
        getOfflineHaderLogs(user).then(res => {
          if (res.length > 0) {
            // const nDays = res.length;
            res.forEach(offlineDay => {
              props
                .saveHaderOfflineLogs({
                  day: day(offlineDay.day),
                  prayers: {
                    fajr: offlineDay.fajr,
                    dhuhr: offlineDay.dhuhr,
                    asr: offlineDay.asr,
                    maghrib: offlineDay.maghrib,
                    isha: offlineDay.isha
                  }
                })
                .then(res => {
                  if (res) {
                    deleteHaderLogsByDay(offlineDay.id);
                  } else {
                    toast.error('error syncing offline logs', {
                      position: 'top-right',
                      autoClose: true,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined
                    });
                  }
                });
            });
          }
        });
        // getOfflineDayLogs(user).then(res => {
        //   res.forEach(offlineDay => {
        //     props
        //       .saveOfflineLogs({
        //         day: day(offlineDay.day),
        //         prayers: {
        //           fajr: offlineDay.fajr || 0,
        //           dhuhr: offlineDay.dhuhr || 0,
        //           asr: offlineDay.asr || 0,
        //           maghrib: offlineDay.maghrib || 0,
        //           isha: offlineDay.isha || 0
        //         }
        //       })
        //       .then(res => {
        //         if (res) {
        //           deleteDayLogsByDay(offlineDay.id);
        //         } else {
        //           // TODO: Alert
        //           console.log('error uploading offline logs');
        //         }
        //       });
        //   });
        // });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const user = props.userInfo?.user?._id;
    if (user) {
      getOfflineDayLogs(user).then(res => {
        if (res.length > 0) {
          const nDays = res.length;
          const Msg = ({ closeToast, toastProps }) => (
            <div>
              You have offline entries for {nDays} days, do you want to upload
              them online, or just delete them?
              <div className='mt-3'>
                <button
                  className='btn btn-success py-2'
                  onClick={() => {
                    onClickSync(user);
                    closeToast();
                  }}>
                  Upload
                </button>
                <button
                  className='btn btn-danger py-2 mx-2'
                  onClick={() => {
                    onClickDelete(user);
                    closeToast();
                  }}>
                  Delete
                </button>
              </div>
            </div>
          );
          toast.info(Msg, {
            position: 'top-right',
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            draggable: false,
            progress: undefined
          });
        }
      });

      getOfflineHaderLogs(user).then(res => {
        if (res.length > 0) {
          // const nDays = res.length;
          res.forEach(offlineDay => {
            props
              .saveHaderOfflineLogs({
                day: day(offlineDay.day),
                prayers: {
                  fajr: offlineDay.fajr,
                  dhuhr: offlineDay.dhuhr,
                  asr: offlineDay.asr,
                  maghrib: offlineDay.maghrib,
                  isha: offlineDay.isha
                }
              })
              .then(res => {
                if (res) {
                  deleteHaderLogsByDay(offlineDay.id);
                } else {
                  toast.error('error syncing offline logs', {
                    position: 'top-right',
                    autoClose: true,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                  });
                }
              });
          });
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userInfo?.user?._id]);
  const handleJoyrideCallback = data => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      // this.setState({ run: false });
      // window.localStorage.setItem('tutorialDone', true)
      props.updatePreferences({ tutorialDone: true });
    }
  };
  const changeLanguage = code => {
    setLanguage(code);
  };
  return (
    <div
      className={`h-100 d-flex flex-column${
        language.indexOf('ar') > -1 ? ' ar' : ''
      }`}>
      <ToastContainer />
      <Router>
        <Header changeLanguage={changeLanguage} />
        <Offline />

        <main className='flex-grow-1 d-flex align-items-center'>
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
                locale={{
                  back: t('back'),
                  close: t('close'),
                  last: t('last'),
                  next: t('next'),
                  skip: t('skip')
                }}
              />
            )}
          <Route exact path='/reset-password' component={ResetPassword} />
          <Route exact path='/forgot-password' component={ForgotPassword} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />

          <ProtectedRoute exact path='/logs' component={Logs} />
          <ProtectedRoute exact path='/' component={Home} />
          <Route exact path='/landing'  render={() => <LandingPage  changeLanguage={changeLanguage}/>} />
        </main>
        <Footer />
      </Router>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
