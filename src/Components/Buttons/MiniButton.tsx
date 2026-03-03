import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {Button} from 'react-native-paper';
import {colors} from '../../Theme/colors';
import {scale} from 'react-native-size-matters';

type Props = {
  title: string;
  buttonColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
};

const MiniButton = (props: Props) => {
  const {title, buttonColor, style, contentStyle, labelStyle, onPress} = props;
  const btnColor = buttonColor ? buttonColor : colors.lightGreen;
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default MiniButton;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingVertical: 6,
  },
  textStyle: {
    color: colors.white,
  },
  button: {
    backgroundColor: colors.lightGreen,
    alignSelf: 'flex-end',
    marginTop: 12,
    borderRadius: 4,
    alignItems: 'center',
    width: scale(70),
    justifyContent: 'center',
    height: scale(25),
  },
  buttonText: {
    color: colors.white,
    width: 80,
    fontSize: 12,
    textAlign: 'center',
  },
});
