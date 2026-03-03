import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  document: [],
};

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setDocument: (state, action) => {
      state.document = action.payload;
    },

    resetDocument: state => {
      state.document = [];
    },
  },
});

export const {setDocument, resetDocument} = documentSlice.actions;
export default documentSlice.reducer;
