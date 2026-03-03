import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

export type EVENT = {
  activityId: null | number;
  id: number;
  name: string;
  email_from: string;
  phone: string;
  contact_name: false;
  description: string;
  user_id: number;
  partner_id: false;
  create_date?: string;
  destination: boolean | string;
  destination_lat: number;
  destination_long: number;
  activities: [
    {
      id: null | number;
      activity_create_date: string;
      activity_type: string;
      summary: false;
      date_deadline: string;
      activity_status: string;
    },
  ];
};

export type EVENTFORCALENDER = {
  activityId: null | number;
  title?: string;
  start?: any;
  end?: any;
  id: number;
  name: string;
  email_from: string;
  phone: string;
  contact_name: false;
  description: string;
  user_id: number;
  partner_id: false;
  create_date?: string;
  destination: boolean | string;
  destination_lat: number;
  destination_long: number;
  activities: [
    {
      id: null | number;
      activity_create_date: string;
      activity_type: string;
      summary: false;
      date_deadline: string;
      activity_status: string;
    },
  ];
};
export type HomeScreenState = {
  events: EVENT[];
  eventsForCalender: EVENTFORCALENDER[];
  selectedPickerDate: Date;
  selectedPickerDateFormatted: string;
  selectedMode: 'List' | 'Month';
  weekDays: any[];
  eventLoader: boolean;
};

const initialState: HomeScreenState = {
  events: [],
  eventsForCalender: [],
  selectedPickerDate: new Date(),
  selectedMode: 'List',
  selectedPickerDateFormatted: `${moment(new Date()).format('YYYY-MM-DD')}`,
  weekDays: [],
  eventLoader: false,
};

export const homeScreenSlice = createSlice({
  name: 'homeData',
  initialState,
  reducers: {
    setEventLoader: (state, action) => {
      state.eventLoader = action.payload;
    },
    setEventInStore: (state, action) => {
      state.events = action.payload;
    },
    setEventForCalenderInStore: (state, action) => {
      state.eventsForCalender = action.payload;
    },
    resetEventForCalenderInStore: state => {
      state.eventsForCalender = [];
    },
    resetEventInStore: state => {
      state.events = [];
    },
    setCalendarDateInStore: (state, action) => {
      state.selectedPickerDate = action.payload;
      state.selectedPickerDateFormatted = moment(action.payload).format(
        'YYYY-MM-DD',
      );
    },
    setSelectedModeInStore: (state, action) => {
      state.selectedMode = action.payload;
    },
    setWeekDaysHeader: (state, action) => {
      state.weekDays = action.payload;
    },
    resetHomeScreenStore: state => {
      state.events = [];
      state.selectedPickerDate = new Date();
      state.selectedMode = 'List';
      state.selectedPickerDateFormatted = moment(new Date()).format(
        'YYYY-MM-DD',
      );
      state.weekDays = [];
      state.eventLoader = false;
    },
  },
});

export const {
  setEventInStore,
  resetEventInStore,
  setCalendarDateInStore,
  setSelectedModeInStore,
  setWeekDaysHeader,
  setEventLoader,
  resetHomeScreenStore,
  resetEventForCalenderInStore,
  setEventForCalenderInStore,
} = homeScreenSlice.actions;

export default homeScreenSlice.reducer;
