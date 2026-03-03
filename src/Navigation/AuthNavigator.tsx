import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../Screens/Auth/Splash';
import Login from '../Screens/Auth/Login';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import OTP from '../Screens/Auth/OTP';
import {SCREENS} from './MainNavigator';
import ResetPassword from '../Screens/Auth/ResetPassword';

export type AuthStackParamList = {
  [SCREENS.SPLASH]: undefined;
  [SCREENS.OTP]: undefined;
  [SCREENS.FORGOTPASSWORD]: undefined;
  [SCREENS.LOGIN]: undefined;
  [SCREENS.RESETPASSWORD]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.SPLASH}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={SCREENS.SPLASH} component={Splash} />
      <Stack.Screen name={SCREENS.LOGIN} component={Login} />
      <Stack.Screen name={SCREENS.OTP} component={OTP} />
      <Stack.Screen name={SCREENS.FORGOTPASSWORD} component={ForgotPassword} />
      <Stack.Screen name={SCREENS.RESETPASSWORD} component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
