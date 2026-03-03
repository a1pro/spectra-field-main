import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import styles from './style';
import {colors} from '../../Theme/colors';
import { scale } from 'react-native-size-matters';

interface TrackingButtonsProps {
  handleStopTimer?: () => void;
  handleCompleteJob: () => void;
  startTaskTracking: boolean;
  onPressSendSignature: () => void;

}

const TrackingButtons: React.FC<TrackingButtonsProps> = ({
  onPressSendSignature,
  handleCompleteJob,
  startTaskTracking,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
        marginHorizontal: 20,        
      }}>
      {/* Stop Timer Button */}
      {/* <TouchableOpacity
        disabled={!startTaskTracking}
        style={[
          styles.btn,
          {
            backgroundColor: !startTaskTracking
              ? colors?.lightGrey2
              : colors?.red,
            marginRight: 10,
          },
        ]}
        onPress={handleStopTimer}>
        <Text style={styles.btnText}>Stop Timer</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={[
          styles.btn,
         {
          marginRight:scale(5),
          backgroundColor: colors?.black,

         }
        ]}
        onPress={onPressSendSignature}>
        <Text style={styles.btnText}>Send More Signatures</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.btn,
          {
            backgroundColor: colors?.lightGreen,
          },
        ]}
        onPress={handleCompleteJob}>
        <Text style={styles.btnText}>Complete Job</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TrackingButtons;
