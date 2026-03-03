import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SCREENS, TabParamList} from './MainNavigator';
import {CustomTabBar} from '../Components/CustomTab/CustomTabBar';
import DashBoard from '../Screens/DashBoard';
import Document from '../Screens/Document';
import Media from '../Screens/Media';
import MainStack from './MainStack';
const Tab = createBottomTabNavigator<TabParamList>();

export default function BottomNav() {
  return (
    <Tab.Navigator
      initialRouteName={SCREENS.DASHBOARD}
      screenOptions={{headerShown: false, tabBarHideOnKeyboard: true}}
      tabBar={(props: any) => {
        return <CustomTabBar {...props} />;
      }}>
      <Tab.Screen name={SCREENS.DASHBOARD} component={MainStack} />
      <Tab.Screen name={SCREENS.DOCUMENT} component={Document} />
      <Tab.Screen name={SCREENS.MEDIA} component={Media} />
      <Tab.Screen name={SCREENS.PHONE} component={DashBoard} />
    </Tab.Navigator>
  );
}
