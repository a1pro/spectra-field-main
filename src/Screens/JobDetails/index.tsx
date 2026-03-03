import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import CustomButton from '../../Components/Buttons/CustomButton';
import {SCREENS} from '../../Navigation/MainNavigator';
import {colors} from '../../Theme/colors';

const JobDetails = ({navigation, route}: any) => {
  const data = route?.params.data;

  return (
    <View style={styles.container}>
      <Text style={styles.login}>Job Details</Text>
      <View style={{flex: 1}}>
        <TextInput value={data?.name} style={styles.inputStyle} />
        <TextInput value={data?.adderss} style={styles.inputStyle} />
        <TextInput value={data?.details} style={styles.inputStyle} />
      </View>
      <CustomButton
        title={'Start Task'}
        onPress={() => {
          navigation.navigate(SCREENS.JOBPROGRESS);
        }}
        labelStyle={{color: colors.white}}
        // style={styles.button}
      />
    </View>
  );
};

export default JobDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  inputStyle: {
    backgroundColor: 'transparent',
    fontSize: 14,
    paddingHorizontal: 6,
    borderWidth: 0.5,
    marginBottom: 20,
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    // height: 48,
    marginTop: 10,
    // flex: 1,
  },
  login: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: '25%',
    fontWeight: 'bold',
  },
  con: {marginTop: 80, flex: 1},
});
