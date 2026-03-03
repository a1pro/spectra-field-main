import {combineReducers, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import homeScreenSlicer from '../Slicres/homeScreenSlicer';
import authSlice from '../Slicres/authSlice';
import ticketDetailSlicer from '../Slicres/ticketDetailSlicer';
import checkListSlicer from '../Slicres/checkListSlicer';
import taskManagementSlice from '../Slicres/ticketManagement';
import documentSlicer from '../Slicres/documentSlicer';
import bottomScreen from '../Slicres/bottomScreen';
import permissionSlicer from '../Slicres/permissionSlicer';
import  detailsSlicer  from '../Slicres/companyDetailsSlice';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['homeData', 'taskManagement', 'ticketDetails', 'permission'],
};

const rootReducer = combineReducers({
  homeData: homeScreenSlicer,
  authData: authSlice,
  ticketDetails: ticketDetailSlicer,
  checkList: checkListSlicer,
  taskManagement: taskManagementSlice,
  document: documentSlicer,
  bottom: bottomScreen,
  permission: permissionSlicer,
  details: detailsSlicer,

});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
