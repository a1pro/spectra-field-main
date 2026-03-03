import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  screen: 'Home',
  tabBarVisible: true,
};

export const bottomScreenSlice = createSlice({
  name: 'bottom',
  initialState,
  reducers: {
    setScreen: (state, action) => {
      state.screen = action.payload;
    },
    setTabBarVisible: (state, action) => {
      state.tabBarVisible = action.payload;
    },
  },
});

export const { setScreen, setTabBarVisible } = bottomScreenSlice.actions;

export default bottomScreenSlice.reducer;
