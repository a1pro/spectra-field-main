import React from 'react';
import {ActivityIndicator, View} from 'react-native';

type LoaderProps = {
  color: string;
  size?: any;
  style?:any
};

const AppLoader = ({color, size, style}: LoaderProps) => {
  return (
    <View style={style ?? null}>
      <ActivityIndicator size={size ?? 'small'} color={color} />
    </View>
  );
};

export default AppLoader;
