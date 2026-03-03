import React, { useEffect, useState, useRef, JSX } from "react";
console.log("App.tsx reloaded at", new Date().toISOString());
import {
  SafeAreaView,
  StatusBar,
  AppState,
  Platform,
  LogBox,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, persistor } from "./src/Redux/Store";
import { PersistGate } from "redux-persist/integration/react";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getItem } from "./src/Services/storage";
import { RootNavigator } from "./src/Navigation/RootNavigator";
import { signInUser, signOutUser } from "./src/Redux/Slicres/authSlice";
import { colors } from "./src/Theme/colors";
import {
  TicketDetailState,
  setLocationInStore,
  updateTime,
} from "./src/Redux/Slicres/ticketDetailSlicer";
import { LOCATION, postLocation } from "./src/Services/api/tickets";
import { getUserLocation } from "./src/Services/permissions";
import { useInterval } from "usehooks-ts";
import Toast from "react-native-toast-message";
import { check, PERMISSIONS } from "react-native-permissions";
import NetInfo from "@react-native-community/netinfo";
import { setOfflinePhotos } from "./src/Redux/Slicres/ticketDetailSlicer";
import { postAttachments } from "./src/Services/api/attachments";
import { postCustomerFeedbackandSignature } from "./src/Services/api/feedback";
import { postInstallerFeedbackandSignature } from "./src/Services/api/feedback";
import { resetAllCheckLists } from "./src/Redux/Slicres/checkListSlicer";
import { resetTicketDetails } from "./src/Redux/Slicres/ticketDetailSlicer";
import { resetHomeScreenStore } from "./src/Redux/Slicres/homeScreenSlicer";
import { resetTicketManagment } from "./src/Redux/Slicres/ticketManagement";
import { updateTimeManually } from "./src/Redux/Slicres/ticketDetailSlicer";
import MultiImageFromCameraOnce from "./src/Screens/TicketStatus/CustomCamera";
import moment from "moment";
LogBox.ignoreAllLogs();
const AppContent = (): JSX.Element => {
  const dispatch = useDispatch();
  const ticketDetails: TicketDetailState | any = useSelector(
    (state: any) => state?.ticketDetails
  );
  const tokenFromStore = useSelector((state: any) => state?.authData);
  const offlineData: any = useSelector((state: any) => state?.ticketDetails);
  const storedStartTime: any = useSelector(
    (state: any) => state?.ticketDetails.startTime
  );
  const [appState, setAppState] = useState(AppState.currentState);
  const trackingIntervalRef = useRef(null);
  const storedTimeIntervalRef = useRef(null);
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: any) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        try {
          if (storedStartTime) {
            const startTime = storedStartTime;
            const currentTime = moment();
            const elapsedSeconds = currentTime.diff(
              moment(startTime),
              "seconds"
            );
            if (elapsedSeconds > 0) {
              const hours = Math.floor(elapsedSeconds / 3600);
              const minutes = Math.floor((elapsedSeconds % 3600) / 60);
              const seconds = elapsedSeconds % 60;
              console.log(
                `Resuming Timer - Hours: ${hours}, Minutes: ${minutes}, Seconds: ${seconds}`
              );
              dispatch(updateTimeManually({ hours, minutes, seconds }));
            }
          }
        } catch (error) {
          console.log("Error restoring timer on app focus:", error);
        }
      }
      setAppState(nextAppState);
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, [appState, dispatch]);
  useEffect(() => {
    if (ticketDetails?.startTaskTracking && !trackingIntervalRef.current) {
      trackingIntervalRef.current = setInterval(() => {
        dispatch(updateTime());
      }, 1100);
    } else if (
      !ticketDetails?.startTaskTracking &&
      trackingIntervalRef.current
    ) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
    };
  }, [ticketDetails?.startTaskTracking]);
  useEffect(() => {
    if (storedStartTime !== "" && !storedTimeIntervalRef.current) {
      storedTimeIntervalRef.current = setInterval(() => {
        func();
      }, 1800000);
    } else if (storedStartTime === "" && storedTimeIntervalRef.current) {
      clearInterval(storedTimeIntervalRef.current);
      storedTimeIntervalRef.current = null;
    }
    return () => {
      if (storedTimeIntervalRef.current) {
        clearInterval(storedTimeIntervalRef.current);
        storedTimeIntervalRef.current = null;
      }
    };
  }, [storedStartTime]);
  const func = async () => {
    try {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        if (
          offlineData?.offlineimages?.some((item: any) => item?.sent === false)
        ) {
          console.log("Uploading Offline Images...");
          await ImageUpload(offlineData?.customerFinalRemarks[0]);
        } else if (offlineData?.finalRemarks?.length > 0) {
          console.log("Posting Final Feedback and Signature (Installer)...");
          await postFeedbackandSignatureInstaller(
            offlineData?.finalRemarks[0],
            offlineData?.customerFinalRemarks[0]
          );
        } else if (offlineData?.customerFinalRemarks?.[0]) {
          console.log("Posting Final Feedback and Signature...");
          await postFeedbackandSignature(offlineData?.customerFinalRemarks[0]);
        }
      } else {
        console.log("No internet connection. Skipping upload.");
      }
    } catch (error) {
      console.error("Error in func():", error);
    }
  };
  const ImageUpload = async (formData: any) => {
    const updatedOfflineImages = await Promise.all(
      offlineData?.offlineimages.map(async (item: any) => {
        if (item?.sent === false) {
          await postAttachmentToBackend(item);
          return { ...item, sent: true };
        }
        return item;
      })
    );
    dispatch(setOfflinePhotos(updatedOfflineImages));
    offlineData?.finalRemarks.length > 0
      ? postFeedbackandSignatureInstaller(
          offlineData?.finalRemarks[0],
          formData
        )
      : formData && postFeedbackandSignature(formData);
  };
  const postAttachmentToBackend = async (formBody: any) => {
    let formData1 = new FormData();
    formData1.append("lead_id", JSON.stringify(ticketDetails?.id));
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
  const postFeedbackandSignature = async (body: any) => {
    postCustomerFeedbackandSignature(body)
      .then((res: any) => {
        dispatch(resetTicketManagment());
        dispatch(resetHomeScreenStore());
        dispatch(resetTicketDetails());
        dispatch(resetAllCheckLists());
      })
      .catch((error) => {
        console.error("Error details:", {
          message: error?.message,
          config: error?.config,
          code: error?.code,
          status: error?.response?.status,
          headers: error?.response?.headers,
        });
      });
  };
  const postFeedbackandSignatureInstaller = async (
    body: any,
    formData: any
  ) => {
    postInstallerFeedbackandSignature(body)
      .then((res: any) => {})
      .catch((error) => {
        console.error("Error details:", {
          message: error?.message,
          config: error?.config,
          code: error?.code,
          status: error?.response?.status,
          headers: error?.response?.headers,
        });
      });
    formData && postFeedbackandSignature(formData);
  };
  const checkLocationPermission = async () => {
    if (Platform.OS === "ios") {
      await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
  };
  useInterval(
    () => {
      if (ticketDetails?.startTaskTracking) {
        getUserLocation()
          .then((res: any) => {
            dispatch(setLocationInStore(res.coords));
            const body: LOCATION = {
              activity_id: ticketDetails?.inProgressTicketDetail?.activityId,
              longitude: res.coords?.longitude,
              latitude: res.coords?.latitude,
            };
            postLocation(body)
              .then((res: any) => {
                console.log("postLocation", JSON.stringify(res));
              })
              .catch((err: any) => {
                console.log("err", err);
              });
          })
          .catch((error: any) => {});
      }
    },
    ticketDetails?.startTaskTracking ? 600000 : null
  );
  const appInit = async () => {
    let token = await getItem("Token");
    if (token) {
      dispatch(signInUser(token));
    } else {
      dispatch(signOutUser(token));
    }
  };
  useEffect(() => {
    appInit();
    checkLocationPermission();
  }, [tokenFromStore.token]);
  useEffect(() => {
    const checkInternetConnection = () => {
      NetInfo.fetch().then((state) => {
        // if (!state.isConnected) {
        //   setNoInternetModalVisible(true);
        // } else {
        //   setNoInternetModalVisible(false);
        // }
      });
    };
    const intervalId = setInterval(checkInternetConnection, 180000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <StatusBar backgroundColor={colors.black} />
        <RootNavigator />
        <Toast />
        {/* <Modal
          visible={noInternetModalVisible}
          transparent={true}
          animationType="slide">
          <View style={styles.over}>
            <View style={styles.modal}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: scale(16),
                  fontWeight: '600',
                  marginBottom: scale(20),
                }}>
                Warning
              </Text>
              <Text
                style={{
                  color: colors.black,
                  fontSize: scale(14),
                  fontWeight: '400',
                }}>
                No Internet, Please check your internet connection to continue.
              </Text>
              <TouchableOpacity
                style={styles.modalbtn}
                onPress={() => {
                  setNoInternetModalVisible(false);
                }}>
                <Text style={styles.ok}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}
      </PaperProvider>
    </GestureHandlerRootView>
  );
};
const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <SafeAreaView style={{ backgroundColor: colors.white, flex: 1 }}>
            <AppContent />
          </SafeAreaView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};
export default App;
