import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {colors} from '../../Theme/colors';

type MENUPROPS = {
  onPress: () => void;
  icon: any;
  heading: string;
  button?: boolean;
  onPressCancel?: () => void;
};
export const MenuItem = ({
  onPress,
  icon,
  heading,
  button,
  onPressCancel,
}: MENUPROPS) => {
  return (
    <TouchableOpacity style={styles.box} onPress={onPress}>
      <Image source={icon} style={[styles.image]} />
      <Text style={styles.text}>{heading}</Text>
      {button && (
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.red}]}
          onPress={onPressCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};
