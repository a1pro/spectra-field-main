import {createSlice} from '@reduxjs/toolkit';

export type CHECKLISTBODY = {
  ticket_id: number;
  mileage_check_value: boolean;
  fuel_level_check_value: boolean;
  tire_pressure_check_value: boolean;
  oil_level_check_value: boolean;
  lights_check_value: boolean;
};
export type HSCHECKLIST = {
  ticket_id: number;
  first_aid_kit_check_value: boolean;
  fire_extinguisher_check_value: boolean;
  safety_signs_check_value: boolean;
  emergency_exit_check_value: boolean;
  ppe_check_value: boolean;
};

export type checkListInitial = {
  vanCheckist: CHECKLISTBODY[];
  hsChecklist: HSCHECKLIST[];
  signatures: any[];
  vanCheckListStatus: 'NOT_ELIGIBLE' | 'NOT_SUBMITTED' | 'SUBMITTED'

};

const initialState: checkListInitial = {
  vanCheckist: [],
  hsChecklist: [],
  signatures: [],
  vanCheckListStatus: 'NOT_ELIGIBLE',
};

export const checkListSlicer = createSlice({
  name: 'checkList',
  initialState,
  reducers: {
    setVanCheckList: (state, action) => {
      state.vanCheckist = action.payload;
    },
    setVanCheckListStatus: (state, action) => {
      state.vanCheckListStatus = action.payload;
    },
    setHSCheckList: (state, action) => {
      state.hsChecklist = action.payload;
    },
    setSignaturesInStore: (state, action) => {
      state.signatures = [...state.signatures, action.payload];
    },
    resetAllCheckLists: state => {
      state.hsChecklist = [];
      state.vanCheckist = [];
      state.signatures = [];
      state.vanCheckListStatus = 'NOT_ELIGIBLE';
    },
  },
});

export const {
  setVanCheckList,
  setHSCheckList,
  resetAllCheckLists,
  setVanCheckListStatus,
  setSignaturesInStore,
} = checkListSlicer.actions;

export default checkListSlicer.reducer;
