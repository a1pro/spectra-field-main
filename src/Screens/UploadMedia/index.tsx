import React, { useRef, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  Image,
  Alert,
} from "react-native";
import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
} from "react-native-image-picker";
import { request, PERMISSIONS, check, RESULTS } from "react-native-permissions";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../Theme/colors";
import { RootStackParamList, SCREENS } from "../../Navigation/MainNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { postAttachments } from "../../Services/api/attachments";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { getUserLocation } from "../../Services/permissions";
import ViewShot from "react-native-view-shot";
import UploadMedia from "./uploadMedia";
import styles from "./style";
import Icons from "../../Components/Icons/Icons";
import { scale } from "react-native-size-matters";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomCamera from "../TicketStatus/CustomCamera";
import { useDispatch } from "react-redux";
import { setTabBarVisible } from "../../Redux/Slicres/bottomScreen";
import { useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UploadMediaAfterTicketCompletion = ({ route }: any) => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["30%", "30%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const ticketId = route.params?.ticketId;
  const [noInternetModalVisible, setNoInternetModalVisible] = useState(false);
  const [locationCords, setLocationCords] = useState({});
  const [bottomIndex, setBottomIndex] = useState(-1);
  const [photos, setPhotos] = useState<{ uri: string }[]>([]);
  const [showCustomCamera, setShowCustomCamera] = useState(false);
  const { bottom } = useSafeAreaInsets();
  useLayoutEffect(() => {
    dispatch(setTabBarVisible(false));
    return () => {
      dispatch(setTabBarVisible(true));
    };
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      getLocationAndContinue(() => {});
    }, [])
  );

  const captureViewShot = async (viewShotRef: any) => {
    if (viewShotRef?.current) {
      try {
        const uri = await viewShotRef.current.capture();
      } catch (error) {
        console.error("Error capturing view shot:", error);
        throw error; // Rethrow the error to handle it later
      }
    } else {
      console.error("ViewShot ref is not available");
      throw new Error("ViewShot ref is not available");
    }
  };

  // Change getLocation to open the bottom sheet directly
  const openUploadOptions = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  // Move getUserLocation logic to after photo is selected
  const getLocationAndContinue = async (callback: (coords: any) => void) => {
    try {
      const res = await getUserLocation();
      const coords = (res as any).coords;
      setLocationCords(coords);
      callback(coords);
    } catch (error: any) {
      if (error?.message == "No location provider available.") {
        setNoInternetModalVisible(true);
      } else {
        Alert.alert(
          "Location Error",
          error?.message || "Unable to get location"
        );
      }
    }
  };

  // Update launchCameraOption to get location after photo
  const launchCameraOption = async (viewShotRef: any) => {
    let options: CameraOptions = {
      mediaType: "photo",
      quality: 0.5,
      maxWidth: 768,
      maxHeight: 1024,
    };
    const platformCameraPermission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;
    check(platformCameraPermission).then(async (status) => {
      if (status === RESULTS.GRANTED) {
        await launchCamera(options)
          .then(async (result: any) => {
            if (result.assets !== undefined) {
              setPhotos(result.assets);
              getLocationAndContinue(() => {
                setTimeout(() => {
                  captureViewShot(viewShotRef);
                }, 500);
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        request(platformCameraPermission).then(async (result) => {
          if (result === RESULTS.GRANTED) {
            await launchCamera(options)
              .then((result: any) => {
                if (result.assets !== undefined) {
                  setPhotos(result.assets);
                  getLocationAndContinue(() => {
                    setTimeout(() => {
                      captureViewShot(viewShotRef);
                    }, 500);
                  });
                }
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            Alert.alert("Permission Denied", "Camera permission is required.");
          }
        });
      }
    });
  };

  // Update launchGalleryOption to get location after photo
  const launchGalleryOption = async () => {
    let options: ImageLibraryOptions = {
      quality: 0.5,
      mediaType: "photo",
    };
    const galleryPermission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY;
    check(galleryPermission).then(async (status) => {
      if (status === RESULTS.GRANTED) {
        await launchImageLibrary(options)
          .then(async (result: any) => {
            if (result.assets !== undefined) {
              setPhotos(result.assets);
              getLocationAndContinue(() => {
                setTimeout(() => {
                  captureViewShot(viewShotRef);
                }, 500);
              });
            }
          })
          .catch(() => {});
      } else {
        request(galleryPermission).then(async (result) => {
          if (result === RESULTS.GRANTED) {
            await launchImageLibrary(options)
              .then(async (result: any) => {
                if (result.assets !== undefined) {
                  setPhotos(result.assets);
                  getLocationAndContinue(() => {
                    setTimeout(() => {
                      captureViewShot(viewShotRef);
                    }, 500);
                  });
                }
              })
              .catch((error) => {});
          } else {
            Alert.alert("Permission Denied", "Gallery permission is required.");
          }
        });
      }
    });
  };

  const handleCustomCameraDone = (images: string[]) => {
    setShowCustomCamera(false);
    if (images && images.length > 0) {
      setPhotos(images.map((uri) => ({ uri })));

      const uri = images[0];

      setTimeout(() => {
        let formBody = {
          uri,
          fileType: "image/jpeg",
          fileName: uri.split("/").pop(),
        };
        postAttachmentToBackend(formBody);
      }, 1000);
    }
  };

  const postAttachmentToBackend = async (formBody: any) => {
    let formData1 = new FormData();
    formData1.append("lead_id", JSON.stringify(ticketId));
    formData1.append("attachment", {
      uri: formBody?.uri,
      type: formBody?.fileType,
      name: formBody?.fileName,
    });

    try {
      const res: any = await postAttachments(formData1);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={{ flex: 1, paddingBottom: bottom }}>
          {showCustomCamera ? (
            <CustomCamera
              onDone={handleCustomCameraDone}
              showOtherCords={true}
              locationCords={locationCords}
            />
          ) : (
            <>
              <View
                style={{
                  paddingHorizontal: scale(20),
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: scale(30),
                }}
              >
                <Icons
                  name="arrowleft"
                  iconType={"AntDesign"}
                  color={colors.black}
                  size={scale(24)}
                  onPress={() => navigation.goBack()}
                />
                <Image
                  source={require("../../Assets/Images/Logo.png")}
                  style={styles.img}
                />
              </View>
              <UploadMedia
                photos={photos}
                openUploadOptions={openUploadOptions}
                viewShotRef={viewShotRef}
                locationCords={locationCords}
              />
            </>
          )}
        </View>

        <BottomSheet
          index={-1}
          snapPoints={snapPoints}
          ref={bottomSheetRef}
          style={{ borderRadius: 20 }}
          enablePanDownToClose
          onClose={() => bottomSheetRef?.current?.close()}
          bottomInset={insets.bottom}
        >
          <BottomSheetView
            style={{
              flex: 1,
              margin: 20,
              height: "90%",
              paddingBottom: insets.bottom,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={styles.bottomBtn}
                onPress={() => {
                  setShowCustomCamera(true);
                  bottomSheetRef?.current?.close();
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
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
                  bottomSheetRef?.current?.close();
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: colors.white,
                  }}
                >
                  Open Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheet>

        <Modal
          visible={noInternetModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>
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
    </GestureHandlerRootView>
  );
};

export default UploadMediaAfterTicketCompletion;
