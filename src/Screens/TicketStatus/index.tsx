import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {
  request,
  PERMISSIONS,
  check,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import {
  setStartTaskTracking,
  TicketDetailState,
  setPhotos,
  setOfflinePhotos,
} from '../../Redux/Slicres/ticketDetailSlicer';
import { setTabBarVisible } from '../../Redux/Slicres/bottomScreen';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style';
import { colors } from '../../Theme/colors';
import { RootStackParamList, SCREENS } from '../../Navigation/MainNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setIsTaskTrackedAndCompleted } from '../../Redux/Slicres/ticketManagement';
import { postAttachments } from '../../Services/api/attachments';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { getUserLocation } from '../../Services/permissions';
import { requestGalleryPermission } from '../../Services/permissions';
import { setLocationInStore } from '../../Redux/Slicres/ticketDetailSlicer';
import Timer from './timer';
import UploadMedia from './uploadMedia';
import ViewShot from 'react-native-view-shot';
import TrackingButtons from './trackingButtons';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import AppLoader from '../../Components/AppLoader';
import CustomCamera from './CustomCamera';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TicketStatus = ({ route }: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const snapPoints = useMemo(() => ['30%', '30%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const [noInternetModalVisible, setNoInternetModalVisible] = useState(false);
  const [bottomIndex, setBottomIndex] = useState(-1);
  const formatTime = (time: number) => String(time).padStart(2, '0');
  const ticketDetails: TicketDetailState | any = useSelector(
    (state: any) => state?.ticketDetails,
  );
  const inProgressTicketDetail: any = useSelector(
    (state: any) => state?.ticketDetails?.inProgressTicketDetail,
  );
  const offline: any = useSelector(
    (state: any) => state?.ticketDetails?.offlineimages,
  );
  const [load, setLoad] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Hide tab bar only when camera is open
  // useLayoutEffect(() => {
  //   const parent = navigation.getParent && navigation.getParent();
  //   if (parent) {
  //     if (showCamera) {
  //       parent.setOptions({ tabBarStyle: { display: 'none' } });
  //     } else {
  //       parent.setOptions({ tabBarStyle: undefined });
  //     }
  //   }
  // }, [showCamera, navigation]);

  const handleCameraDone = async (images: string[]) => {
    setShowCamera(false);
    dispatch(setTabBarVisible(true));
  };

  const captureViewShot = async (viewShotRef: any, data: any) => {
    if (viewShotRef?.current) {
      try {
        const uri = await viewShotRef.current.capture();
        let formBody = {
          uri,
          fileType: 'image/jpeg',
          fileName: uri.split('/').pop(),
        };

        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected) {
          postAttachmentToBackend(formBody);
          dispatch(
            setOfflinePhotos([
              ...offline,
              { ...formBody, img: data[0]?.uri, sent: true },
            ]),
          );
        } else {
          dispatch(
            setOfflinePhotos([
              ...offline,
              { ...formBody, img: data[0]?.uri, sent: false },
            ]),
          );
        }
        setTimeout(() => {
          dispatch(setPhotos([]));
        }, 1000);
      } catch (error) {
        console.error('Error capturing view shot:', error);
        throw error; // Rethrow the error to handle it later
      }
    } else {
      console.error('ViewShot ref is not available');
      throw new Error('ViewShot ref is not available');
    }
  };

  const launchGalleryOption = async () => {
    let options: ImageLibraryOptions = {
      quality: 0.5,
      mediaType: 'photo',
    };
    check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(async statuses => {
      if (statuses === 'granted') {
        await launchImageLibrary(options)
          .then(async result => {
            if (result.assets !== undefined) {
              dispatch(setPhotos(result.assets));
              setTimeout(() => {
                captureViewShot(viewShotRef, result.assets);
              }, 500);
            }
          })
          .catch(() => {});
      } else {
        request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(async () => {
          await launchImageLibrary(options)
            .then(async result => {
              if (result.assets !== undefined) {
                dispatch(setPhotos(result.assets));
                setTimeout(() => {
                  captureViewShot(viewShotRef, result.assets);
                }, 500);
              }
            })
            .catch(error => {
              // getImage('');
            });
        });
      }
    });
  };

  const postAttachmentToBackend = async (formBody: any) => {
    let formData1 = new FormData();
    formData1.append('lead_id', JSON.stringify(inProgressTicketDetail?.id));
    formData1.append('attachment', {
      uri: formBody?.uri,
      type: formBody?.fileType,
      name: formBody?.fileName,
    });

    try {
      const res: any = await postAttachments(formData1);
      console.log(
        'res in postAttachmentToBackend',
        JSON.stringify(res, null, 2),
      ); //TODO show a toast
    } catch (err) {
      console.log('err', err);
    }
  };

  const handleStopTimer = () => {
    //that's if user stopped time tracking view should be the same cause still can send attachment
    setShowCamera(false);
    dispatch(setStartTaskTracking(false));
  };

  const onPressSendSignature = async () => {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      navigation.navigate(SCREENS.EXTRACHECKLIST);
    } else {
      Alert.alert('Alert', 'Internet required to add more signatures');
    }
  };

  const handleCompleteJob = () => {
    dispatch(setStartTaskTracking(false));
    dispatch(setIsTaskTrackedAndCompleted(true));
    navigation.navigate(SCREENS.FEEDBACK);
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getLocation = async () => {
    const permissionGranted = await requestLocationPermission();
    if (!permissionGranted && Platform.OS === 'android') {
      console.log('Location permission denied');
      return;
    }

    bottomSheetRef.current?.snapToIndex(0);
    getUserLocation()
      .then((res: any) => {
        dispatch(setLocationInStore(res.coords));
      })
      .catch((error: any) => {
        if (error?.message == 'No location provider available.') {
          setNoInternetModalVisible(true);
        } else {
          console.log('Location error:', error);
        }
      });
  };

  const saveToGallery = async (fileUri: string) => {
    if (!fileUri) {
      console.warn('Empty URI passed to saveToGallery');
      return;
    }

    if (Platform.OS === 'android') {
      const fileName = fileUri.split('/').pop();
      const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;
      await RNFS.copyFile(fileUri, destPath);
      await RNFS.scanFile(destPath);
      return destPath;
    } else if (Platform.OS === 'ios') {
      await CameraRoll.save(fileUri, { type: 'photo' });
      return fileUri;
    }
  };

  // const saveImages = async () => {
  //   let permission;
  //   if (Platform.OS === 'ios') {
  //     permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
  //   } else {
  //     permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  //   }
  //   let status = await check(permission);
  //   console.log('Gallery permission status:', status);
  //   if (status === RESULTS.BLOCKED) {
  //     Alert.alert(
  //       'Permission Required',
  //       'Gallery permission is blocked. Please enable it in settings.',
  //       [
  //         { text: 'Cancel', style: 'cancel' },
  //         { text: 'Open Settings', onPress: () => openSettings() },
  //       ],
  //     );
  //     return;
  //   }
  //   if (status === RESULTS.DENIED) {
  //     status = await request(permission);
  //     console.log('Gallery permission status after request:', status);
  //   }
  //   if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
  //     try {
  //       const savedPaths = await Promise.all(
  //         ticketDetails?.offlineimages.map((file: any) =>
  //           saveToGallery(file.img || file.uri),
  //         ),
  //       );
  //       Alert.alert('Success', `Images saved to gallery`);
  //     } catch (error) {
  //       console.error('Error saving images:', error);
  //       Alert.alert('Error', 'Failed to save images. Please try again.');
  //     }
  //   } else {
  //     Alert.alert(
  //       'Permission Required',
  //       'Gallery permission is required to save images.',
  //     );
  //   }
  // };
  const getAndroidPermission = () => {
    const androidVersion = Number(Platform.Version);
    if (androidVersion >= 33) {
      // Android 13+
      return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
    } else {
      // Android < 13
      return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    }
  };

  const saveImages = async () => {
    let permission;

    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else {
      permission = getAndroidPermission();
    }

    let status = await check(permission);
    console.log('Gallery permission status:', status);

    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Required',
        'Gallery permission is blocked. Please enable it in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openSettings() },
        ],
      );
      return;
    }

    if (status === RESULTS.DENIED) {
      status = await request(permission);
      console.log('Gallery permission status after request:', status);
    }

    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
      try {
        const savedPaths = await Promise.all(
          ticketDetails?.offlineimages.map((file: any) =>
            saveToGallery(file.img || file.uri),
          ),
        );
        Alert.alert('Success', `Images saved to gallery`);
      } catch (error) {
        console.error('Error saving images:', error);
        Alert.alert('Error', 'Failed to save images. Please try again.');
      }
    } else {
      Alert.alert(
        'Permission Required',
        'Gallery permission is required to save images.',
      );
    }
  };
  return (
    <BottomSheetModalProvider>
      {load && (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppLoader color={colors.white} size={'large'} />
        </View>
      )}

      {showCamera ? (
        <CustomCamera
          onDone={handleCameraDone}
          showOtherCords={false}
          locationCords={null}
        />
      ) : (
        <View style={{ marginBottom: -10 }}>
          <View style={{ height: '90%' }}>
            <TrackingButtons
              handleStopTimer={handleStopTimer}
              handleCompleteJob={handleCompleteJob}
              startTaskTracking={ticketDetails?.startTaskTracking}
              onPressSendSignature={onPressSendSignature}
            />
            <View style={styles.timer}>
              <Timer
                hours={ticketDetails?.hours}
                minutes={ticketDetails?.minutes}
                seconds={ticketDetails?.seconds}
                formatTime={formatTime}
              />
            </View>
            <View style={styles.divider} />

            <UploadMedia
              ticketDetails={ticketDetails}
              getLocation={getLocation}
              viewShotRef={viewShotRef}
            />
          </View>
          {ticketDetails?.offlineimages.length > 0 &&
          ticketDetails?.photo.length == 0 ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  saveImages();
                }}
                style={{
                  backgroundColor: colors.lightGreen,
                  height: 40,
                  marginHorizontal: 20,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  // marginBottom: Platform.OS === 'ios' ? 50 : 80,
                }}
              >
                <Text style={{ color: 'white', fontSize: 18 }}>
                  Save images to gallery
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            ''
          )}
          {/* <View style={{ marginBottom: -20 }}> */}
          <BottomSheet
            index={bottomIndex}
            snapPoints={snapPoints}
            ref={bottomSheetRef}
            style={{ borderRadius: 20 }}
            enablePanDownToClose
            onClose={() => setBottomIndex(-1)}
          >
            <BottomSheetView style={{ flex: 1, margin: 20, height: '90%' }}>
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                  style={styles.bottomBtn}
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    dispatch(setTabBarVisible(false));
                    setBottomIndex(-1);
                    setShowCamera(true);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: colors.white,
                    }}
                  >
                    Open Camera
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomBtn}
                  onPress={() => {
                    launchGalleryOption();
                    setBottomIndex(-1); // Only use setBottomIndex to close
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: colors.white,
                    }}
                  >
                    Open Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheet>
          {/* </View> */}
        </View>
      )}

      <Modal
        visible={noInternetModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>
              No Location, Please check your location to continue.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setNoInternetModalVisible(false);
              }}
            >
              <Text style={styles.ok}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </BottomSheetModalProvider>
  );
};

export default TicketStatus;
