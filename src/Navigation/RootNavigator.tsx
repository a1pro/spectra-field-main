import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AuthNavigator, {AuthStackParamList} from './AuthNavigator';
import AppNavigator from './AppNavigator';
import {RootStackParamList} from './MainNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';

export type RootAppStackParamList = {
  Auth: AuthStackParamList;
  App: RootStackParamList;
};

const Stack = createNativeStackNavigator<RootAppStackParamList>();

export const Root = () => {
  const status = useSelector((state: any) => state.authData.status);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'none',
      }}>
      {status == 'signOut' ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="App" component={AppNavigator} />
      )}
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
