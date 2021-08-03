import i18next from 'i18next';

export const introSteps = [
  {
    target: '.logo',
    content: i18next.t('tutorial:intro.1')
  },
  {
    target: '.home',
    content: i18next.t('tutorial:intro.2'),
    placement: 'center'
  }
];
export const counterSteps = [
  {
    target: '.counter',
    content: i18next.t('tutorial:counter.1')
  },
  {
    target: '.addPrayer',
    content: i18next.t('tutorial:counter.2')
  },
  {
    target: '.addManyPrayers',
    content: i18next.t('tutorial:counter.3')
  },
  {
    target: '.manyPrayersCount',
    content: i18next.t('tutorial:counter.4')
  },
  {
    target: '.saveManyPrayers',
    content: i18next.t('tutorial:counter.5')
  },
  {
    target: '.prayersCount',
    content: i18next.t('tutorial:counter.6')
  },
  {
    target: '.addDay',
    content: i18next.t('tutorial:counter.7')
  },
  {
    target: '.counter',
    content: i18next.t('tutorial:counter.8')
  },
  {
    target: '.addDay',
    content: i18next.t('tutorial:counter.9')
  },
  {
    target: '.counter',
    content: i18next.t('tutorial:counter.10')
  }
];

export const calendarSteps = [
  { target: '.logs', content: i18next.t('tutorial:calendar.1') },
  { target: '.calendar', content: i18next.t('tutorial:calendar.1') },
  {
    target: '.count',
    content: i18next.t('tutorial:calendar.2')
  },
  {
    target: '.hader-done',
    content: i18next.t('tutorial:calendar.4')
  },
  {
    target: '.dayDetails',
    content: i18next.t('tutorial:calendar.3')
  }
];

export const settingsSteps = [
  {
    target: '.settings',
    content: i18next.t('tutorial:settings.1')
  },
  {
    target: '.startDate',
    content: i18next.t('tutorial:settings.2')
  },
  {
    target: '.endDate',
    content: i18next.t('tutorial:settings.3')
  },
  {
    target: '.isFemale',
    content: i18next.t('tutorial:settings.4')
  },
  {
    target: '.period',
    content: i18next.t('tutorial:settings.5')
  },
  {
    target: '.dailyTarget',
    content: i18next.t('tutorial:settings.6')
  },
  {
    target: '.saveSettings',
    content: i18next.t('tutorial:settings.7')
  },
  {
    target: '.personal',
    content: i18next.t('tutorial:settings.8')
  }
];
