import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  vanCheck: false,
  hsCheck: false,
  isTaskTrackedAndCompleted: false,
  taskTimeTrackingInProgress: false,
  installerfeedbackSent: false,
};

export const taskManagementSlice = createSlice({
  name: 'taskManagement',
  initialState,
  reducers: {
    setIsVANCheck: (state, action) => {
      state.vanCheck = action.payload;
    },
    setIsHSCheck: (state, action) => {
      state.hsCheck = action.payload;
    },
    setIsTaskTrackedAndCompleted: (state, action) => {
      state.isTaskTrackedAndCompleted = action.payload;
    },
    setIsInstallerfeedbackSent: (state, action) => {
      state.installerfeedbackSent = action.payload;
    },
    resetTicketManagment: state => {
      (state.vanCheck = false),
        (state.hsCheck = false),
        (state.isTaskTrackedAndCompleted = false),
        (state.taskTimeTrackingInProgress = false),
        (state.installerfeedbackSent = false);
    },
  },
});

export const {
  setIsVANCheck,
  setIsHSCheck,
  setIsTaskTrackedAndCompleted,
  resetTicketManagment,
  setIsInstallerfeedbackSent,
} = taskManagementSlice.actions;

export default taskManagementSlice.reducer;
