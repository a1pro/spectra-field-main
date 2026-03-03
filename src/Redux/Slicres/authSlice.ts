import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {removeItem} from '../../Services/storage';

type AuthState = {
  token: string | null;
  status: 'signOut' | 'signIn';
  loading: boolean;
};
const initialState: AuthState = {
  token: null,
  status: 'signOut',
  loading: false,
};
export const signOutUserThunk = createAsyncThunk(
  'auth/signOutUser',
  async (_, {dispatch}) => {
    await removeItem('Token');
    dispatch(signOutUser());
  },
);

export const authSlice = createSlice({
  name: 'authData',
  initialState,
  reducers: {
    signInUser: (state, action) => {
      state.status = 'signIn';
      state.token = action.payload;
    },
    signOutUser: state => {
      state.status = 'signOut';
      state.token = null;
    },
    setTokenInStore: (state, action) => {
      state.token = action.payload;
    },
    signInStatus: state => {
      state.status = 'signIn';
    },
    setLoadingLogin: (state, action) => {
      state.loading = action.payload;
    },
    resetAuth: state => {
      state.status = 'signOut';
      state.token = null;
      state.loading = false;
    },
  },
});

export const {
  signInUser,
  signOutUser,
  setTokenInStore,
  signInStatus,
  setLoadingLogin,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
