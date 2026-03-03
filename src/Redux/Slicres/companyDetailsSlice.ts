import {createSlice} from '@reduxjs/toolkit';

export type DETAILSBODY = {
  name?: string,
  phone?:string,    
  email?: string,
  website?: string,
  street?: boolean,
  city?: boolean,
  state?: string,
  zip?: boolean,
  country?: string,
  vat?: boolean,
  currency?: string,
};


export type checkListInitial = {
  companyDetails: DETAILSBODY;
};

const initialState: checkListInitial = {
  companyDetails: {
      name: '',
      phone: '',
      email: '',
      website: '',
      street: false,
      city: false,
      state: '',
      zip: false,
      country: '',
      vat: false,
      currency: ''
  },
};

export const detailsSlicer = createSlice({
  name: 'details',
  initialState,
  reducers: {
    setCompanyDetails: (state, action) => {
      state.companyDetails = action.payload;
    },
    resetAllDetails: state => {
      state.companyDetails = {
        name: '',
        phone: '',
        email: '',
        website: '',
        street: false,
        city: false,
        state: '',
        zip: false,
        country: '',
        vat: false,
        currency: ''
    };

    },
  },
});

export const {
  setCompanyDetails,
  resetAllDetails,
} = detailsSlicer.actions;

export default detailsSlicer.reducer;
