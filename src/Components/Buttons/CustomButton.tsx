import React from 'react';
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';
import {colors} from '../../Theme/colors';
import AppLoader from '../AppLoader';
import {scale} from 'react-native-size-matters';

type Props = {
  title: string;
  buttonColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const CustomButton = (props: Props) => {
  const {
    title,
    buttonColor,
    style,
    contentStyle,
    labelStyle,
    onPress,
    disabled,
    loading,
  } = props;
  const btnColor = buttonColor ? buttonColor : colors.lightGreen;
  return (
    <Button
      disabled={disabled ? true : false}
      mode={'text'}
      buttonColor={btnColor}
      contentStyle={contentStyle}
      style={[styles.container, style]}
      labelStyle={[styles.textStyle, labelStyle]}
      onPress={onPress}>
      {loading ? <AppLoader color={colors?.white} /> : title}
    </Button>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(8),
  },
  textStyle: {
    color: colors.white,
  },
});
