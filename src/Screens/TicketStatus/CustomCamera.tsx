import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import ViewShot from "react-native-view-shot";
import LinearGradient from "react-native-linear-gradient";
import RNFS from "react-native-fs";
import NetInfo from "@react-native-community/netinfo";
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { postAttachments } from "../../Services/api/attachments";
import { useDispatch, useSelector } from "react-redux";
import { setOfflinePhotos } from "../../Redux/Slicres/ticketDetailSlicer";
import { colors } from "../../Theme/colors";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { scale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type CustomCameraProps = {
  onDone: (images: string[]) => void;
  showOtherCords: boolean;
  locationCords: any;
};

const CustomCamera: React.FC<CustomCameraProps> = ({
  onDone,
  showOtherCords,
  locationCords,
}) => {
  const ticketDetails: any = useSelector((state: any) => state?.ticketDetails);
  const inProgressTicketDetail: any = useSelector(
    (state: any) => state?.ticketDetails?.inProgressTicketDetail
  );
  const offline: any = useSelector(
    (state: any) => state?.ticketDetails?.offlineimages
  );
  const insets = useSafeAreaInsets();
  const [images, setImages] = useState<string[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dispatch = useDispatch();
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [focalLength, setFocalLength] = useState(0);
  const [lastZoom, setLastZoom] = useState(1);
  const navigation = useNavigation();
  const [hideButtons, setHideButtons] = useState(false);

  useLayoutEffect(() => {
    const parent = navigation.getParent && navigation.getParent();
    if (parent) {
      parent.setOptions({ tabBarStyle: { display: "none" } });
    }
    return () => {
      if (parent) {
        parent.setOptions({ tabBarStyle: undefined });
      }
    };
  }, [navigation]);

  const requestAndroidPermissions = async () => {
    if (Platform.OS === "android") {
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      const audioGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      return (
        cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
        audioGranted === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  useEffect(() => {
    (async () => {
      const iosCam = await Camera.requestCameraPermission();
      const iosMic = await Camera.requestMicrophonePermission();
      const androidPermission = await requestAndroidPermissions();
      if (Platform.OS === "android") {
        if (androidPermission) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } else {
        setHasPermission(true);
      }
    })();
  }, []);

  const devices = useCameraDevices();
  const [device, setDevice] = useState<any>(null);

  useEffect(() => {
    if (Array.isArray(devices)) {
      const backCam = devices.find((d: any) => d.position === "back");
      setDevice(
        backCam ?? devices.find((d: any) => d.position === "front") ?? null
      );
    } else if ((devices as any)?.back || (devices as any)?.front) {
      setDevice((devices as any).back ?? (devices as any).front ?? null);
    }
  }, [devices]);

  const onPinchGestureEvent = (event: any) => {
    const newZoom = Math.max(
      1,
      Math.min(10, lastZoom * event.nativeEvent.scale)
    );
    setZoom(newZoom);
  };

  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      setLastZoom(zoom);
    }
  };

  const resetZoom = () => {
    setZoom(1);
    setLastZoom(1);
  };

  const onDoubleTap = () => {
    resetZoom();
  };

  const onPanGestureEvent = (event: any) => {
    // Handle pan gesture for moving the zoomed view
    // This can be implemented if needed for more advanced zoom behavior
  };

  const capturePhotoFromCamera = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        flash: "off",
      });
      setCapturedPhoto(`file://${photo.path}`);
      setImageLoaded(false);
    }
  };

  const saveOverlayImage = async () => {
    setHideButtons(true);
    setTimeout(async () => {
      if (
        viewShotRef.current &&
        typeof viewShotRef.current.capture === "function"
      ) {
        const uri = await viewShotRef.current.capture();
        const newPath = `${RNFS.DocumentDirectoryPath}/${uuidv4()}.jpg`;
        await RNFS.moveFile(uri.replace("file://", ""), newPath);
        const newUri = `file://${newPath}`;
        setImages((prev) => [...prev, newUri]);
        setCapturedPhoto(null);
        setImageLoaded(false);
        const netInfo = await NetInfo.fetch();
        let formBody = {
          uri: newUri,
          fileType: "image/jpeg",
          fileName: uri.split("/").pop(),
        };

        if (netInfo.isConnected) {
          postAttachmentToBackend(formBody);
          dispatch(
            setOfflinePhotos([
              ...offline,
              { ...formBody, img: newUri, sent: true },
            ])
          );
        } else {
          dispatch(
            setOfflinePhotos([
              ...offline,
              { ...formBody, img: newUri, sent: false },
            ])
          );
        }
      }
      setHideButtons(false);
    }, 100); // Wait for UI to update
  };

  const postAttachmentToBackend = async (formBody: any) => {
    let formData1 = new FormData();
    formData1.append("lead_id", JSON.stringify(inProgressTicketDetail?.id));
    formData1.append("attachment", {
      uri: formBody?.uri,
      type: formBody?.fileType,
      name: formBody?.fileName,
    });

    try {
      const res: any = await postAttachments(formData1);
      console.log(
        "res in postAttachmentToBackend",
        JSON.stringify(res, null, 2)
      ); //TODO show a toast
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    if (capturedPhoto) {
      Image.getSize(
        capturedPhoto,
        (width, height) => setImageDimensions({ width, height }),
        () => setImageDimensions(null)
      );
    } else {
      setImageDimensions(null);
    }
  }, [capturedPhoto]);

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>Requesting permissions...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text>No camera device found.</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!capturedPhoto ? (
        <>
          <TapGestureHandler numberOfTaps={2} onActivated={onDoubleTap}>
            <PinchGestureHandler
              onGestureEvent={onPinchGestureEvent}
              onHandlerStateChange={onPinchHandlerStateChange}
            >
              <View style={{ flex: 1 }}>
                <Camera
                  ref={cameraRef}
                  style={{ flex: 1 }}
                  device={device}
                  isActive
                  photo
                  zoom={zoom}
                />
                {zoom > 1 && (
                  <View style={styles.zoomIndicator}>
                    <Text style={styles.zoomText}>{zoom.toFixed(1)}x</Text>
                  </View>
                )}
                {/* Controls overlay for camera mode */}
                <View
                  style={styles.controlsOverlay(insets)}
                  pointerEvents="box-none"
                >
                  <View style={styles.controlsRow}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={capturePhotoFromCamera}
                    >
                      <Text style={styles.buttonText}>Take Photo</Text>
                    </TouchableOpacity>
                    {zoom > 1 && (
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: "#666" }]}
                        onPress={resetZoom}
                      >
                        <Text style={styles.buttonText}>Reset Zoom</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => onDone(images)}
                    >
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </PinchGestureHandler>
          </TapGestureHandler>
        </>
      ) : (
        <>
          <ViewShot
            ref={viewShotRef}
            options={{ format: "jpg", quality: 0.9 }}
            style={{ flex: 1 }}
          >
            <ImageBackground
              source={{ uri: capturedPhoto }}
              resizeMode="cover"
              style={{
                flex: 1,
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
              }} // ensure full fill
              onLoadEnd={() => setImageLoaded(true)}
            >
              {!imageLoaded && (
                <View style={styles.loaderOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
              {showOtherCords ? (
                <LinearGradient
                  colors={["transparent", "transparent"]}
                  style={styles.gradient}
                >
                  <View style={styles.con}>
                    <Text style={styles.timestamp}>
                      {new Date().toLocaleString()}
                    </Text>
                    <Text style={styles.coordinates}>
                      Latitude: {locationCords?.latitude}, Longitude:{" "}
                      {locationCords?.longitude}
                    </Text>
                  </View>
                </LinearGradient>
              ) : (
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.5)"]}
                  style={styles.overlay}
                >
                  <Text style={styles.overlayText} numberOfLines={2}>
                    Latitude: {ticketDetails?.location?.latitude}, Longitude:{" "}
                    {ticketDetails?.location.longitude}
                  </Text>
                </LinearGradient>
              )}
            </ImageBackground>
          </ViewShot>
          {/* Only show buttons if not hiding for capture */}
          {!hideButtons && (
            <View
              style={styles.controlsOverlay(insets)}
              pointerEvents="box-none"
            >
              <View style={styles.controlsRow}>
                <TouchableOpacity
                  style={[styles.button, { opacity: imageLoaded ? 1 : 0.5 }]}
                  onPress={() => {
                    saveOverlayImage();
                  }}
                  disabled={!imageLoaded}
                >
                  <Text style={styles.buttonText}>Save Image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setCapturedPhoto(null)}
                >
                  <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default CustomCamera;

const styles = StyleSheet.create({
  overlay: {
    // padding: 16,
  },
  overlayText: {
    color: colors.lightGreen,
    fontSize: 16,
    textAlign: "center",
  },
  // Remove old controls style from layout flow
  // controls: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   marginVertical: 20,
  // },
  controlsOverlay: (insets: any) => ({
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: insets.bottom + 24,
    paddingHorizontal: 16,
    // Optionally add a gradient or backgroundColor for better visibility
    // backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 10,
  }),
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  zoomIndicator: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  zoomText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  con: {
    flex: 1,
    justifyContent: "flex-end",
    marginLeft: scale(5),
    marginBottom: scale(5),
  },
  timestamp: {
    color: colors.white,
    fontSize: scale(12),
    // marginBottom: 10,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  coordinates: {
    color: colors.lightGreen,
    fontSize: scale(12),
  },
});
