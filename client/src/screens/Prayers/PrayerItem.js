import React, { Component } from 'react';
import { Col, Form, Button, Badge, ListGroup } from 'react-bootstrap';

export default class PrayerItem extends Component {
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
    const { prayer } = this.props;
    // console.log(this.props);
    // console.log( JSON.parse(window.localStorage.getItem('logs')));
    // const dbTotal = (window.localStorage.getItem('prayers') && JSON.parse(window.localStorage.getItem('prayers'))[prayer.toLowerCase()]) || 0;
    let { dbTotal } = this.props;
    const width = this.getWidth();
    const percent = Math.round(parseFloat(width) * 100) / 100;
    // console.log(Math.round(parseFloat(width) * 100))
    return (
      <ListGroup.Item as='li' key={prayer} className='d-flex flex-row p-0'>
        {this.state.showMany && this.state.prayer === prayer ? (
          <>
            <Button
              title='make up many'
              className='btn-light py-0 px-1 step-6 d-flex align-items-center'
              onClick={this.onShowMany}>
              <ion-icon name='close'></ion-icon>
              {/* <img src={`${process.env.PUBLIC_URL}/addMany.svg`} width='16' height='16' alt=''/> */}
            </Button>
            <Col className='d-flex flex-column justify-content-around align-items-start my-auto px-0'>
              <div className='d-flex align-items-center px-4'>
                <div className='d-flex flex-column mr-3'>
                  <small className='mr-2 very-small-text'>Add many</small>
                  <Form.Control
                    type='number'
                    name='number'
                    id='count-prayers'
                    placeholder='#'
                    bsSize='sm'
                    className='custom-input'
                    value={this.state.manyCount}
                    onChange={this.changeManyCount}
                    // style={{width: '10%', height: '1rem', borderRadius: 0}}
                  />
                </div>
                <Button
                  variant='light'
                  title='make up many'
                  className='py-0 px-1'
                  onClick={this.onMakeupMany}>
                  Add
                </Button>
              </div>
            </Col>
          </>
        ) : (
          <>
            <Button
              title='make up many'
              className='btn-light py-0 px-1 step-6 d-flex align-items-center'
              onClick={this.onShowMany}>
              <ion-icon name='duplicate-outline'></ion-icon>
              {/* <img src={`${process.env.PUBLIC_URL}/addMany.svg`} width='16' height='16' alt=''/> */}
            </Button>
            <Col className='d-flex flex-column justify-content-around align-items-start my-auto px-0'>
              {/* <div className='many-container'>jdnf</div> */}
              <div className='px-3'>
                <div className='p-0 d-flex'>
                  <b>{prayer}</b>
                  {window.localStorage.getItem(prayer) > 0 ? (
                    <Badge variant='light' className='ml-3 my-auto'>
                      {percent}%
                    </Badge>
                  ) : null}
                </div>
                {/* <div className='d-flex flex-column very-small-text'> */}
                {window.localStorage.getItem(prayer) > 0 ? (
                  <small className='text-secondary-lt d-flex very-small-text'>
                    Remaining
                    <div className='font-weight-bold mx-2'>
                      {this.calculateCurrentTotal()}
                    </div>
                    Out of
                    <div className='font-weight-bold mx-2'>
                      {window.localStorage.getItem(prayer)}
                    </div>
                  </small>
                ) : null}
              </div>
              {/* </div> */}
              <div className='progress'>
                <div
                  className='progress-bar'
                  role='progressbar'
                  aria-valuenow='0'
                  aria-valuemin='0'
                  aria-valuemax='100'
                  style={{ width }}></div>
              </div>
            </Col>
          </>
        )}
        <Col
          sm={{ size: 5 }}
          md={{ size: 4 }}
          className='made-up font-weight-bold ml-auto p-0 d-flex flex-row align-items-center'>
          <Button
            title='missed a prayer'
            className='py-3 px-2 btn-dark step-5'
            onClick={this.onMiss}>
            -
          </Button>
          <div className='mx-auto d-flex flex-column text-center step-3'>
            <small className='text-secondary-lt very-small-text'>Made up</small>
            <small>{dbTotal}</small>
          </div>
          {/* <div className='d-flex flex-column justify-content-around'> */}
          <Button
            title='made up a prayer'
            className='btn-success py-3 px-2 step-4'
            onClick={this.onMakeup}>
            +
          </Button>
          {/* </div> */}
        </Col>
      </ListGroup.Item>
    );
  }
}
