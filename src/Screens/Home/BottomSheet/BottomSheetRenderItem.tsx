import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../style';
import {colors} from '../../../Theme/colors';

const BottomSheetRenderItem = ({onPress}: any) => {
  return (
    <View style={styles.containerBottom}>
      <Text style={styles.head}>Ticket already in progress</Text>
      <Text style={styles.common}>
        You can only start one task at 1 time. You can stop
      </Text>
      <Text style={[styles.common, {marginTop: 0}]}>
        your current task & try again to start this task
      </Text>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: '#5A5A5A',
          marginTop: 20,
          borderRadius: 5,
        }}
        onPress={onPress}>
        <Text
          style={{
            color: colors.white,
            fontSize: 14,
            paddingHorizontal: 8,
            paddingVertical: 8,
          }}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomSheetRenderItem;
