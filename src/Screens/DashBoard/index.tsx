import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../Theme/colors";
import { SCREENS } from "../../Navigation/MainNavigator";
import { confirmVanChecklistStatus } from "../../Services/api/checklist";
import { useDispatch, useSelector } from "react-redux";
import {
  checkListInitial,
  setVanCheckListStatus,
} from "../../Redux/Slicres/checkListSlicer";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { scale } from "react-native-size-matters";
import { MenuItem } from "../../Components/MenuItem";

import { resetTicketDetails } from "../../Redux/Slicres/ticketDetailSlicer";
import { resetAuth } from "../../Redux/Slicres/authSlice";
import { resetDocument } from "../../Redux/Slicres/documentSlicer";
import { resetHomeScreenStore } from "../../Redux/Slicres/homeScreenSlicer";
import { resetPermissions } from "../../Redux/Slicres/permissionSlicer";
import { resetTicketManagment } from "../../Redux/Slicres/ticketManagement";
import { resetAllCheckLists } from "../../Redux/Slicres/checkListSlicer";
import { removeAllItems } from "../../Services/storage";
import { setSelectedModeInStore } from "../../Redux/Slicres/homeScreenSlicer";
import { useFocusEffect } from "@react-navigation/native";
import { getCompanyDetails } from "../../Services/api/companyDetails";
import {
  DETAILSBODY,
  setCompanyDetails,
} from "../../Redux/Slicres/companyDetailsSlice";
import { cancelTicket } from "../../Services/api/tickets";
import NetInfo from "@react-native-community/netinfo";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const DashBoard = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const checklistDetails: checkListInitial = useSelector(
    (state: any) => state.checkList
  );
  const companyDetails: DETAILSBODY = useSelector(
    (state: any) => state.details?.companyDetails
  );
  const inProgressTicketDetail: any = useSelector(
    (state: any) => state?.ticketDetails?.inProgressTicketDetail
  );
  const screen = useSelector((state: any) => state.bottom.screen);
  const snapPoints = useMemo(() => ["60%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState(false);

  // Custom Backdrop
  const CustomBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
      pressBehavior="none"
    />
  );

  useEffect(() => {
    if (screen === "PHONE") {
      setTimeout(() => {
        bottomSheetRef.current?.snapToIndex(0);
      }, 100);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [screen]);

  useFocusEffect(
    useCallback(() => {
      DashboardApiCalls();
    }, [])
  );

  const DashboardApiCalls = async () => {
    setLoading(true);
    dispatch(setSelectedModeInStore("List"));

    try {
      await confirmVanChecklistStatus()
        .then((res: any) => {
          dispatch(setVanCheckListStatus(res?.data?.status));
        })
        .catch((error: any) => {
          console.log("error in getting all tickts", error);
          setLoading(false);
        });
    } catch (error) {
      console.log("error in getting all tickets", error);
      setLoading(false);
    }

    try {
      await getCompanyDetails()
        .then((res: any) => {
          dispatch(setCompanyDetails(res?.data?.company_details));
        })
        .catch((error: any) => {
          console.log("error in getting company_details", error);
          setLoading(false);
        });
    } catch (error) {
      console.log("error in getting company_details", error);
      setLoading(false);
    }

    setLoading(false);
  };

  const onPressCalendar = async () => {
    if (
      checklistDetails?.vanCheckListStatus === "NOT_ELIGIBLE" ||
      checklistDetails?.vanCheckListStatus === "SUBMITTED"
    ) {
      navigation.navigate(SCREENS.HOME);
    } else {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        Alert.alert(
          "Warning",
          `You have not checked van checklist in last 7 days or there's some issue with internet connection`,
          [
            {
              text: "Okay",
              onPress: () => {
                DashboardApiCalls();
              },
            },
            {
              text: "Refresh",
              onPress: () => {
                DashboardApiCalls();
              },
            },
          ]
        );
      } else {
        Alert.alert("Warning", "Internet is required to continue", [
          {
            text: "Okay",
            onPress: () => {
              DashboardApiCalls();
            },
          },
        ]);
      }
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const logoutUser = () => {
    dispatch(resetAuth());
    dispatch(resetTicketDetails());
    dispatch(resetDocument());
    dispatch(resetHomeScreenStore());
    dispatch(resetPermissions());
    dispatch(resetTicketManagment());
    dispatch(resetAllCheckLists());
    removeAllItems();
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container} edges={["top"]}>
          {loading === true && (
            <View style={styles.indicator}>
              <ActivityIndicator color={colors.lightGreen} size={"large"} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 50,
                marginTop: 15,
              }}
            >
              <Image
                source={require("../../Assets/Images/Logo.png")}
                style={{ width: scale(74), height: scale(37) }}
              />
              <TouchableOpacity
                onPress={() => {
                  logoutUser();
                }}
              >
                {/* <Image source={icons?.logout} style={[styles.logout]} /> */}
                <Text
                  style={{
                    color: colors.red,
                    marginTop: 10,
                    fontWeight: "500",
                  }}
                >
                  Log out
                </Text>
              </TouchableOpacity>
            </View>

            <MenuItem
              onPress={onPressCalendar}
              icon={
                inProgressTicketDetail?.activityId
                  ? require("../../../src/Assets/setting.gif")
                  : require("../../../src/Assets/calendar.gif")
              }
              heading={
                inProgressTicketDetail?.activityId
                  ? "See In Progress Task"
                  : "Calender"
              }
            />
            {checklistDetails?.vanCheckListStatus !== "NOT_ELIGIBLE" && (
              <MenuItem
                onPress={() => {
                  if (checklistDetails?.vanCheckListStatus === "SUBMITTED") {
                    Alert.alert(
                      "Warning",
                      "You already have submitted Van Checklist",
                      [
                        {
                          text: "Okay",
                          onPress: () => null,
                        },
                      ]
                    );
                  } else {
                    navigation.navigate(SCREENS.VANCHECKLIST);
                  }
                }}
                icon={require("../../../src/Assets/task.gif")}
                heading={"Van Checklist"}
              />
            )}
          </View>
          <Text
            style={{
              color: "gray",
              textAlign: "center",
              marginBottom: 15,
              fontSize: 12,
            }}
          >
            V 0.1.43(8)
          </Text>
        </SafeAreaView>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={CustomBackdrop}
          style={{ zIndex: 1, elevation: 1 }}
          enablePanDownToClose={false}
          enableHandlePanningGesture={false}
          backgroundStyle={{ backgroundColor: colors.smoke }}
          handleIndicatorStyle={{ backgroundColor: colors.black }}
          onClose={() => {}}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="none"
          android_keyboardInputMode="adjustResize"
          enableContentPanningGesture={false}
        >
          <BottomSheetView style={{ flex: 1, margin: 20, height: "30%" }}>
            <View style={{ justifyContent: "space-between" }}>
              <Text style={{ color: colors.black, fontSize: 20 }}>
                Available for Phone Call
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 15,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.black, fontSize: 18 }}>
                  {companyDetails?.phone}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.lightGreen,
                    borderRadius: 10,
                    paddingVertical: scale(5),
                  }}
                  onPress={() => {
                    Linking.openURL(`tel:${companyDetails?.phone}`);
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: scale(14),
                      marginHorizontal: scale(25),
                    }}
                  >
                    Call
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.smoke,
    paddingHorizontal: 20,
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1,
    justifyContent: "center",
  },
  imageStyle: {
    alignSelf: "center",
    marginVertical: "10%",
  },
  logout: {
    alignSelf: "flex-start",
    marginTop: scale(10),
    height: 20,
    width: 65,
  },
  box: {
    backgroundColor: colors.white,
    borderRadius: 4,
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  text: { color: colors.black, marginTop: 3 },
  image: {},
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheet: {
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
});
