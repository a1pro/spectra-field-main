import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {SCREENS} from '../../../Navigation/MainNavigator';
import {colors} from '../../../Theme/colors';

const Splash = ({navigation}: any) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace(SCREENS.LOGIN);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../Assets/Images/Splash.png')}
        width={180}
        height={180}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
