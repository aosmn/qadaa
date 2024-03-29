import React, { Component } from 'react';
import { Button, ListGroup, Form, FloatingLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { LoadingOverlay } from '../Loader';
import LongPressButton from "./LongPressButton";

import PrayerItem from "./PrayerItem";
import { withTranslation } from "react-i18next";
import day from "dayjs";

import {
  getLogs,
  updateDayLogs,
  getPrayerTotals,
  getDayLogs,
} from "../../redux/actions/prayerActions.js";

import { getOfflineTotals } from "../../services/DBHelper";

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  prayerTotals: state.prayerTotals,
  prayers: state.prayerLogs,
  updateError: state.prayerLogs.updateError,
  joyride: state.joyride,
});

const mapDispatchToProps = (dispatch) => ({
  getLogs: (id) => dispatch(getLogs(id)),
  getPrayerTotals: (id) => dispatch(getPrayerTotals(id)),
  updateDayLogs: (log) => dispatch(updateDayLogs(log)),
  getTodayLogs: () => dispatch(getDayLogs()),
});

class PrayersCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offlineTotals: {
        fajr: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
      },
      fajrOfflineTotal: 0,
      dhuhrOfflineTotal: 0,
      asrOfflineTotal: 0,
      maghribOfflineTotal: 0,
      ishaOfflineTotal: 0,
      offlinTotal: 0,
      dayCount: 2,
      prayer: "",
      today: 0,
      showManyDays: false,
      timer: 0,
      timerRunning: false,
      clicksCounter: 0,
      preferences: {},
      showPrayerMany: false,
      prayerManyWhich: "",
      addOnePrayerCount: 2,
    };
  }

  componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.user) {
      getOfflineTotals(this.props.userInfo.user._id).then((totals) => {
        this.setState({
          offlineTotals: totals,
        });
      });
      this.props.getPrayerTotals(this.props.userInfo.user._id);
      this.props.getLogs(this.props.userInfo.user._id);
      this.props.getTodayLogs();
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (
      this.props.updateError !== prevProps.updateError ||
      this.props.prayerTotals.loading !== prevProps.prayerTotals.loading
    ) {
      if (this.props.updateError) {
        setTimeout(() => {
          getOfflineTotals(this.props.userInfo.user._id).then((totals) => {
            this.setState({
              offlineTotals: totals,
            });
          });
        }, 1000);
      }
    }
  }

  startTimer = () => {
    clearInterval(this.timer);
    this.setState({ timerRunning: true, timer: 0 });

    this.timer = setInterval(() => {
      if (this.state.timer < 30) {
        this.setState({ timer: this.state.timer + 1 }, () => {
          if (this.state.showManyDays) {
            clearInterval(this.timer);
          }
        });
      } else {
        this.setState({ timer: 0, timerRunning: false });
        clearInterval(this.timer);
      }
    }, 1000);
  };

  onMiss = (prayer) => {
    this.props.updateDayLogs({
      day: { day: day(), tz: new Date().getTimezoneOffset() / 60 },
      prayer,
      count: -1,
    });
    this.setState({ today: this.state.today - 1 });
  };

  onMakeup = (prayer) => {
    this.props.updateDayLogs({
      day: { day: day(), tz: new Date().getTimezoneOffset() / 60 },
      prayer,
      count: 1,
    });
    this.setState({ today: this.state.today + 1 });
  };

  onMakeupMany = (prayer, count) => {
    this.props.updateDayLogs({
      day: { day: day(), tz: new Date().getTimezoneOffset() / 60 },
      prayer,
      count,
    });
    this.setState({ today: this.state.today + count });
  };

  onMakeupDays = (e) => {
    const count = parseInt(this.state.dayCount, 10, this.props.isOffline);
    if (count > 0) {
      this.props.updateDayLogs({
        day: { day: day(), tz: new Date().getTimezoneOffset() / 60 },
        prayer: "all",
        count,
      });
      this.setState({ today: this.state.today + count * 5 });
    }
  };

  onMakeupOneDay = (e) => {
    setTimeout(() => {
      this.props.joyride &&
        this.props.joyride.next &&
        this.props.joyride.next();
    }, 200);
    this.startTimer();
    if (this.state.timerRunning) {
      let newCounter = this.state.clicksCounter + 1;
      let newState = { clicksCounter: newCounter };
      if (newCounter > 2) {
        newState.showManyDays = true;
      }
      this.setState(newState);
    } else {
      this.setState({ clicksCounter: 1 });
    }
    this.props.updateDayLogs({
      day: { day: day(), tz: new Date().getTimezoneOffset() / 60 },
      prayer: "all",
      count: 1,
    });
    this.setState({ today: this.state.today + 1 });
  };

  changeDayCount = (e) => {
    this.setState({ dayCount: e.target.value });
  };

  calculateCurrentTotal = (prayer) => {
    return (
      parseInt(window.localStorage.getItem(prayer)) -
      this.state[prayer + "DBTotal"]
    );
  };
  getWidth = (value, prayer) => {
    return (value / window.localStorage.getItem(prayer)) * 100 + "%";
  };
  cancelMany = () => {
    this.setState({
      showManyDays: false,
      clicksCounter: 0,
    });
  };
  showMany = () => {
    this.setState({
      showManyDays: true,
      clicksCounter: 0,
    });
  };

  setShowPrayerMany = (prayer) => {
    setTimeout(() => {
      this.props.joyride &&
        this.props.joyride.next &&
        this.props.joyride.next();
    }, 200);
    this.setState({
      showPrayerMany: true,
      prayerManyWhich: prayer,
    });
  };
  hidePrayerMany = () => {
    this.setState({
      showPrayerMany: false,
      showManyDays: false,
      prayerManyWhich: "",
    });
  };
  onFocus = () => {
    this.input.select();
  };
  updatePreferences = () => {
    this.setState({
      preferences: JSON.parse(window.localStorage.getItem("preferences")),
    });
  };

  onMakeupPrayerMany = () => {
    setTimeout(() => {
      this.props.joyride &&
        this.props.joyride.next &&
        this.props.joyride.next();
    }, 200);
    const count = parseInt(this.state.addOnePrayerCount);
    this.props.updateDayLogs({
      day: { day: day(), tz: new Date().getTimezoneOffset() / 60 },
      prayer: this.state.prayerManyWhich,
      count,
    });

    this.setState({
      showPrayerMany: false,
      showManyDays: false,
      prayerManyWhich: "",
      addOnePrayerCount: 2,
    });
  };

  onLongPress = (e) => {
    setTimeout(() => {
      this.props.joyride &&
        this.props.joyride.next &&
        this.props.joyride.next();
    }, 200);
    this.setState({
      showManyDays: true,
      prayerManyWhich: "all",
    });
  };
  render() {
    const { t } = this.props;
    let prayers =
      this.props.prayerTotals.totals && this.props.prayerTotals.totals[0];
    return (
      <div className="prayers-container d-flex flex-row">
        {(this.props.prayerTotals.loading ||
          this.props.prayers.updateLoading) && <LoadingOverlay />}
        <div
          className={`overlay ${
            this.state.showPrayerMany || this.state.showManyDays ? "shown" : ""
          }`}
        >
          {(this.state.showPrayerMany || this.state.showManyDays) && (
            <>
              <Button
                variant="link-light"
                title={t("makeUpMany")}
                className="close-button closeOverlay"
                onClick={() => {
                  this.props.joyride &&
                    this.props.joyride.next &&
                    this.props.joyride.next();
                  this.hidePrayerMany();
                }}
              >
                <ion-icon name="close"></ion-icon>
              </Button>
              <div className="content">
                <h6 className="title text-center">
                  {this.state.showManyDays ? (
                    t("addManyDaysTitle")
                  ) : (
                    <>
                      <span>{t("addManyTitle")}</span>
                      <span className="capitalize px-2">
                        ({t(this.state.prayerManyWhich.toLowerCase())})
                      </span>
                    </>
                  )}
                </h6>

                <FloatingLabel
                  className='mb-4'
                  controlId='days'
                  label={`${t('howMany')} ${
                    this.state.showManyDays ? t('aldays') : t('alprayers')
                  }${t('?')}`}>
                  <Form.Control
                    required
                    type="number"
                    min={2}
                    placeholder={`${t("howMany")} ${
                      this.state.showManyDays ? t("aldays") : t("alprayers")
                    }${t("?")}`}
                    value={this.state.addOnePrayerCount}
                    onChange={(e) =>
                      this.setState({ addOnePrayerCount: e.target.value })
                    }
                    className={`${
                      this.state.showManyDays
                        ? 'manyDaysCount'
                        : 'manyPrayersCount'
                    }`}
                  />
                </FloatingLabel>

                <Form.Group controlId='save' className='w-100'>
                  <Button
                    className="w-100 small saveManyPrayers"
                    type="button"
                    variant="light"
                    onClick={this.onMakeupPrayerMany}
                  >
                    {t("save")}
                  </Button>
                </Form.Group>
              </div>
            </>
          )}
        </div>
        <ListGroup className="prayers col px-1 py-3">
          <PrayerItem
            prayer="Fajr"
            dbTotal={prayers && prayers.fajr + this.state.offlineTotals.fajr}
            onMakeup={this.onMakeup}
            onMakeupMany={this.onMakeupMany}
            onMiss={this.onMiss}
            onShowAddMany={() => {
              this.setShowPrayerMany("fajr");
            }}
          />
          <PrayerItem
            prayer="Dhuhr"
            dbTotal={prayers && prayers.dhuhr + this.state.offlineTotals.dhuhr}
            onMakeup={this.onMakeup}
            onMakeupMany={this.onMakeupMany}
            onMiss={this.onMiss}
            onShowAddMany={() => {
              this.setShowPrayerMany("dhuhr");
            }}
          />
          <PrayerItem
            prayer="Asr"
            dbTotal={prayers && prayers.asr + this.state.offlineTotals.asr}
            onMakeup={this.onMakeup}
            onMakeupMany={this.onMakeupMany}
            onMiss={this.onMiss}
            onShowAddMany={() => {
              this.setShowPrayerMany("asr");
            }}
          />
          <PrayerItem
            prayer="Maghrib"
            dbTotal={
              prayers && prayers.maghrib + this.state.offlineTotals.maghrib
            }
            onMakeup={this.onMakeup}
            onMakeupMany={this.onMakeupMany}
            onMiss={this.onMiss}
            onShowAddMany={() => {
              this.setShowPrayerMany("maghrib");
            }}
          />
          <PrayerItem
            prayer="Isha"
            dbTotal={prayers && prayers.isha + this.state.offlineTotals.isha}
            onMakeup={this.onMakeup}
            onMakeupMany={this.onMakeupMany}
            onMiss={this.onMiss}
            onShowAddMany={() => {
              this.setShowPrayerMany("isha");
            }}
          />
        </ListGroup>
        <div className="add-day-container">
          <LongPressButton
            onClick={this.onMakeupOneDay}
            onLongPress={this.onLongPress}
            btnText={<ion-icon name="duplicate-outline"></ion-icon>}
            className="btn-add-many h-100 py-3 px-3 align-items-center addDay"
            variant="primary"
            title={t("makeUpDay")}
            longPressThreshold={700}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("home")(PrayersCounter));
