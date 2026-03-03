import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  location: false,
  camera: false,
  gallery: false,
};

export const permissionSlicer = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setLocationPermission: (state, action) => {
      state.location = action.payload;
    },
    setCameraPermission: (state, action) => {
      state.camera = action.payload;
    },
    setGalleryPermission: (state, action) => {
      state.gallery = action.payload;
    },
    resetPermissions: state => {
      state.location = false;
      state.camera = false;
      state.gallery = false;
    },
  },
});

export const {
  setLocationPermission,
  setCameraPermission,
  setGalleryPermission,
  resetPermissions,
} = permissionSlicer.actions;

export default permissionSlicer.reducer;
