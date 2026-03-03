import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

export interface SpecificTicketDetailState {
  id: number;
  name: string;
  email_from: string;
  phone: string;
  partner_name: false;
  description: string;
  user_id: number;
  partner_id: false;
  create_date?: string;
  destination: boolean | string;
  destination_lat: number;
  destination_long: number;
  x_no_inverter: number;
  x_no_panels: number;
  x_type_panel: string;
  x_type_inverter: string;
  x_no_battery: number;
  x_type_battery: string;
  x_misc_install: string;
  x_mount: string;
  activities: [
    {
      id: null | number;
      activity_create_date: string;
      activity_type: string;
      summary: false;
      date_deadline: string;
      activity_status: string;
      task_notes: string;
    },
  ];
  activityId: null | number;
  survey_doc_attachments: any[];
}

export interface TicketDetailState {
  startTaskTracking: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  startTime: string;
  photo: any[];
  offlineimages: any[];
  galleryImage: string;
  location: any;
  timeString: string;
  inProgressTicketDetail: Record<string, SpecificTicketDetailState> | null;
  inContextTicketId: number | null;
  finalRemarks: any[];
  customerFinalRemarks: any[];
  preview: boolean;
  timerStart: boolean;
  installerRemarks: any;
  customerRemarks: any;
}

const initialState: TicketDetailState = {
  startTaskTracking: false,
  hours: 0,
  minutes: 0,
  seconds: 0,
  startTime: '',
  photo: [],
  offlineimages: [],
  galleryImage: '',
  location: {},
  timeString: moment().format('YYYY-MM-DD HH:mm:ss'),
  inProgressTicketDetail: {},
  inContextTicketId: null,
  finalRemarks: [],
  customerFinalRemarks: [],
  preview: false,
  timerStart: false,
  installerRemarks: {},
  customerRemarks: {},
};

export const ticketDetailSlice = createSlice({
  name: 'ticketDetail',
  initialState,
  reducers: {
    setStartTaskTracking: (state, action: PayloadAction<boolean>) => {
      state.startTaskTracking = action.payload;
    },
    setPreview: (state, action: PayloadAction<boolean>) => {
      state.preview = action.payload;
    },
    updateTime: state => {
      state.seconds = (state.seconds + 1) % 60;
      if (state.seconds === 0) {
        state.minutes = (state.minutes + 1) % 60;
        if (state.minutes === 0) {
          state.hours += 1;
        }
      }
    },

    updateTimeManually: (
      state,
      action: PayloadAction<{
        hours: number;
        minutes: number;
        seconds: number;
      }>,
    ) => {
      state.hours = action.payload.hours;
      state.minutes = action.payload.minutes;
      state.seconds = action.payload.seconds;
    },

    setStartTime: (state, action: PayloadAction<any>) => {
      state.startTime = action.payload;
    },
    setPhotos: (state, action: PayloadAction<any[]>) => {
      state.photo = action.payload;
    },
    setOfflinePhotos: (state, action: PayloadAction<any[]>) => {
      state.offlineimages = action.payload;
    },

    setGalleryImage: (state, action: PayloadAction<string>) => {
      state.galleryImage = action.payload;
    },
    setLocationInStore: (state, action: PayloadAction<any>) => {
      state.location = action.payload;
    },
    setTimeString: (state, action: PayloadAction<string>) => {
      state.timeString = action.payload;
    },
    setFinalRemarks: (state, action: PayloadAction<any>) => {
      state.finalRemarks = action.payload;
    },

    setInstallerRemarks: (state, action: PayloadAction<any>) => {
      state.installerRemarks = action.payload;
    },

    setCustomerRemarks: (state, action: PayloadAction<any>) => {
      state.customerRemarks = action.payload;
    },

    setCustomerFinalRemarks: (state, action: PayloadAction<any>) => {
      state.customerFinalRemarks = action.payload;
    },
    setTimerStart: (state, action: PayloadAction<any>) => {
      state.timerStart = action.payload;
    },
    setInProgressTicketDetail: (
      state,
      action: PayloadAction<Record<string, SpecificTicketDetailState>>,
    ) => {
      state.inProgressTicketDetail = action.payload;
    },
    resetTicketDetails: state => {
      state.startTaskTracking = false;
      state.hours = 0;
      state.minutes = 0;
      state.seconds = 0;
      state.photo = [];
      state.startTime = '';
      state.offlineimages = [];
      state.galleryImage = '';
      state.location = {};
      state.timeString = moment().format('YYYY-MM-DD HH:mm:ss');
      state.inProgressTicketDetail = null;
      state.customerFinalRemarks = [];
      state.finalRemarks = [];
      state.preview = false;
      state.timerStart = false;
      state.installerRemarks = {};
      state.customerRemarks = {};
    },
    setInContextTicketId: (state, action) => {
      state.inContextTicketId = action.payload;
    },
  },
});

export const {
  setStartTaskTracking,
  setPhotos,
  setGalleryImage,
  setLocationInStore,
  setTimeString,
  setInstallerRemarks,
  setInProgressTicketDetail,
  updateTime,
  updateTimeManually,
  setTimerStart,
  setPreview,
  setOfflinePhotos,
  setCustomerFinalRemarks,
  resetTicketDetails,
  setInContextTicketId,
  setFinalRemarks,
  setStartTime,
  setCustomerRemarks,
} = ticketDetailSlice.actions;

export default ticketDetailSlice.reducer;
