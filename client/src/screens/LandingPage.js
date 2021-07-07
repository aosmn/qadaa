import React from 'react';
import '../styles/landing.scss';
import pattern from '../assets/pattern.svg';
import logo from '../assets/logo-white.svg';
import countImg from '../assets/screens/count.png';
import calendarImg from '../assets/screens/calendar.png';
import progressImg from '../assets/screens/progress.png';
import settingsImg from '../assets/screens/settings_c.png';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const LandingPage = () => {
  return (
    <div className='landing h-100 w-100'>
      <div className='title-container-background'>
        <img src={pattern} alt='' className='pattern right' />
        <img src={pattern} alt='' className='pattern left' />
      </div>
      <div className='title-container d-flex w-100 justify-content-center'>
        <div className='d-flex flex-row align-items-center'>
          <img
            src={logo}
            width='60'
            height='72.5'
            alt=''
            className='mx-3 logo'
          />
          <div className='logo-text large text-light'>Qadaa</div>
        </div>
      </div>
      <div className='content'>
        <div className='section d-flex flex-column mt-2 align-items-center'>
          <div className='my-5'>
            <div className='quran d-flex flex-column mt-5 align-items-center text-secondary'>
              <p className='mb-4'>
                "Indeed, I am Allah. There is no deity except Me, so worship Me
                and establish prayer for My remembrance"
              </p>
              <p className='m-0 ar-text'>
                "إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي
                وَأَقِمِ الصَّلَاةَ لِذِكْرِي"
              </p>
            </div>
          </div>
          <div className='w-100 px-5'>
            <hr className='w-100' />
          </div>
          <div className='intro text-center m-5'>
            <h2 className='title'>Make up your qadaa prayers</h2>
            <h6>
              If you have prayers that you want to make up for and fulfill your
              debt to Allah, Qadaa is your companion to do just that.
            </h6>
            <div className='mt-5'>
              <div className='feature'>
                <div className='text'>
                  <span>1. Log </span>
                  your qadaa prayers every day
                </div>
                <img src={countImg} alt='' />
              </div>
              <div className='feature left'>
                <div className='text'>
                  <span>2. Calculate </span>
                  the prayers you missed over the years
                </div>
                <img src={settingsImg} alt='' />
              </div>
              <div className='feature'>
                <div className='text'>
                  <span>3. Set </span>a daily goal to do your qadaa prayers and
                  see your progress
                </div>
                <img src={progressImg} alt='' />
              </div>
              <div className='feature left'>
                <div className='text'>
                  <span>4. View </span>
                  your logs and total prayers you've made up for
                </div>
                <img src={calendarImg} alt='' />
              </div>
            </div>
          </div>
        </div>

        <div className='w-100 px-5'>
          <hr className='w-100' />
        </div>
        <div className='text-center m-5'>
        <Link className='btn btn-primary px-4' to='/register'>
            Register Now !
        </Link>
          {/* <Button className='w-100' type='submit' variant='primary'>
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
