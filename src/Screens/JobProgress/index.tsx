import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import CustomButton from '../../Components/Buttons/CustomButton';
import {SCREENS} from '../../Navigation/MainNavigator';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS, check} from 'react-native-permissions';
import {colors} from '../../Theme/colors';
const JobProgress = ({navigation, route}: any) => {
  const [image, getImage] = useState<string>('');

  // const launchCameraOption = async () => {
  //   let options: any = {
  //     mediaType: 'photo',
  //     quality: 0.5,
  //   };
  //   check(PERMISSIONS.ANDROID.CAMERA).then(async statuses => {
  //     if (statuses === 'granted') {
  //       await launchCamera(options)
  //         .then((result: any) => {
  //           if (result.assets != undefined) {
  //             getImage(result.assets[0]);
  //           }
  //           // setCameraOption(false);
  //         })
  //         .catch(error => {
  //           getImage('');
  //         });
  //     } else {
  //       request(PERMISSIONS.ANDROID.CAMERA).then(async () => {
  //         await launchCamera(options)
  //           .then((result: any) => {
  //             if (result.assets != undefined) {
  //               getImage(result.assets[0]);
  //             }
  //             // setCameraOption(false);
  //           })
  //           .catch(error => {
  //             getImage('');
  //           });
  //       });
  //     }
  //   });
  // };

  const launchGalleryOption = async () => {
    let options: any = {
      quality: 0.5,
      mediaType: 'photo',
    };
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(async statuses => {
        if (statuses === 'granted') {
          await launchImageLibrary(options)
            .then((result: any) => {
              if (result.assets != undefined) {
                getImage(result.assets[0]);
                // setCameraOption(false);
              }
            })
            .catch(() => {
              getImage('');
            });
        } else {
          request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(async () => {
            await launchImageLibrary(options)
              .then((result: any) => {
                if (result.assets != undefined) {
                  getImage(result.assets[0]);
                }
                // setCameraOption(false);
              })
              .catch(error => {
                getImage('');
              });
          });
        }
      });
    }
    if (Platform.OS === 'ios') {
      await launchImageLibrary(options)
        .then((result: any) => {
          if (result.assets != undefined) {
            getImage(result.assets[0]);
            // setCameraOption(false);
          }
        })
        .catch(() => {
          getImage('');
        });
    }
  };

  const scheme = Platform.select({ios: 'maps://', android: 'geo:'});
  const lat = 37.7749; // Example latitude
  const lng = -122.4194; // Example longitude
  const latLng = `${lat},${lng}`;
  const label = 'San Francisco'; // Example label
  const url: any = Platform.select({
    ios: `${scheme}0,0?q=${label}@${latLng}`,
    android: `${scheme}0,0?q=${latLng}(${label})`,
  });

  // const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
  // const latLng = `${lat},${lng}`;
  // const label = 'Custom Label';
  // const url = Platform.select({
  //   ios: `${scheme}${label}@${latLng}`,
  //   android: `${scheme}${latLng}(${label})`
  // });

  // Linking.openURL(url);

  return (
    <View style={styles.container}>
      <Text style={styles.login}>Job Progress</Text>
      <View style={{flex: 1}}>
        <Text style={styles.text}>Start Time </Text>
        <Text style={styles.text}>12 : 30 PM </Text>
        <Text style={styles.text}>Upload Image</Text>
        <TouchableOpacity
          style={{
            height: '25%',
            width: '100%',
            borderWidth: 1,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            launchGalleryOption();
          }}>
          <Text>+</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.text}>See location</Text>
          <TouchableOpacity
            style={{
              height: '25%',
              width: '100%',
              borderWidth: 1,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              Linking.openURL(url);
            }}>
            <Text>location</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <CustomButton
          title={'Start Tracking'}
          onPress={() => {
            navigation.navigate(SCREENS.CHECKLIST);
          }}
          labelStyle={{color: colors.white}}
          style={{width: '45%'}}
        />
        <View style={{width: '5%'}} />
        <CustomButton
          title={'Stop Tracking'}
          onPress={() => {
            // navigation.navigate(SCREENS);
          }}
          labelStyle={{color: colors.white}}
          style={{width: '45%'}}
        />
      </View>
    </View>
  );
};

export default JobProgress;

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
  text: {
    fontSize: 12,
    marginTop: '3%',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  con: {marginTop: 80, flex: 1},
});
