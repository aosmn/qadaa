import React, { Component } from 'react';
import { Col, Button, Badge, ListGroup } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

class PrayerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manyCount: 2,
      showMany: false,
      dbTotal: props.dbTotal,
      prayer: props.prayer
    };
  }

  changeManyCount = e => {
    this.setState({ manyCount: e.target.value });
  };

  onMakeup = e => {
    const { prayer } = this.props;
    this.props.onMakeup(prayer.toLowerCase());
  };
  onMiss = e => {
    const { prayer } = this.props;
    this.props.onMiss(prayer.toLowerCase());
  };

  onShowMany = e => {
    this.setState({ showMany: !this.state.showMany });
  };

  onMakeupMany = e => {
    const { prayer } = this.props;
    const count = parseInt(this.state.manyCount);
    this.props.onMakeupMany(prayer.toLowerCase(), count);
    this.setState({ showMany: false, manyCount: 2 });
  };

  calculateCurrentTotal = () => {
    const { prayer } = this.props;
    return parseInt(window.localStorage.getItem(prayer)) - this.props.dbTotal;
  };
  getWidth = () => {
    const { dbTotal, prayer } = this.props;
    return (dbTotal / window.localStorage.getItem(prayer)) * 100 + '%';
  };
  render() {
    const { prayer, t } = this.props;
    let { dbTotal } = this.props;
    const width = this.getWidth();
    const percent = Math.round(parseFloat(width) * 100) / 100;
    return (
      <ListGroup.Item
        as='li'
        key={prayer}
        className='d-flex flex-row border-0 py-2 justify-content-center'>
        <Button
          variant='primary'
          title={t('makeUpMany')}
          className='btn-round py-0 px-1 d-flex align-items-center addManyPrayers'
          onClick={this.props.onShowAddMany}>
          <ion-icon name='duplicate-outline' title={t('makeUpMany')}></ion-icon>
          {/* <img src={`${process.env.PUBLIC_URL}/addMany.svg`} width='16' height='16' alt=''/> */}
        </Button>
        <Col className='d-flex flex-column justify-content-around align-items-start my-auto px-0'>
          {/* <div className='many-container'>jdnf</div> */}
          <div className='px-3'>
            <div className='p-0 d-flex'>
              <b>{t(prayer.toLowerCase())}</b>
              {window.localStorage.getItem(prayer) > 0 ? (
                <Badge variant='light' className='ml-3 my-auto'>
                  {percent}%
                </Badge>
              ) : null}
            </div>
            {/* <div className='d-flex flex-column very-small-text'> */}
            {/* {window.localStorage.getItem(prayer) > 0 ? ( */}
              {/* <small className='text-secondary-lt d-flex very-small-text'>
                Remaining
                <div className='font-weight-bold mx-2'>
                  {this.calculateCurrentTotal()}
                </div>
                Out of
                <div className='font-weight-bold mx-2'>
                  {window.localStorage.getItem(prayer)}
                </div>
              </small> */}
            {/* ) : null} */}
          </div>
          {/* </div> */}
          {/* <div className='progress'>
                <div
                  className='progress-bar'
                  role='progressbar'
                  aria-valuenow='0'
                  aria-valuemin='0'
                  aria-valuemax='100'
                  style={{ width }}></div>
              </div> */}
        </Col>
        <Col className='font-weight-bold ml-auto p-0 d-flex flex-row align-items-center'>
          <Button
            variant='light'
            title={t('undoPrayer')}
            className='btn-round step-5'
            onClick={this.onMiss}>
            -
          </Button>
          <div className='mx-auto d-flex flex-column text-center step-3 prayersCount'>
            <small className='text-secondary-lt very-small-text'>{t('madeUp')}</small>
            <small>{dbTotal || 0}</small>
          </div>
          {/* <div className='d-flex flex-column justify-content-around'> */}
          <Button
            variant='primary'
            title={t('makeUpPrayer')}
            className={`btn-round addPrayer`}
            onClick={this.onMakeup}>
            <ion-icon name="add-outline"></ion-icon>
          </Button>
          {/* </div> */}
        </Col>
      </ListGroup.Item>
    );
  }
}

export default withTranslation('home')(PrayerItem);
