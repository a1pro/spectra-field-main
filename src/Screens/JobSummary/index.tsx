import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS, check} from 'react-native-permissions';
import {colors} from '../../Theme/colors';
const Home = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.login}>Job Summary</Text>
    </View>
  );
};

export default Home;

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
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
    marginBottom: 20,
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 48,
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
