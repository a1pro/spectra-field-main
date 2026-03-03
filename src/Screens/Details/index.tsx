import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
  ScrollView,
  Alert,
  Modal,
  Button,
  Image,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icons from "../../Components/Icons/Icons";
import { useNavigation } from "@react-navigation/native";
import {
  TicketDetailState,
  setInProgressTicketDetail,
  setStartTaskTracking,
  updateTime,
} from "../../Redux/Slicres/ticketDetailSlicer";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style";
import {
  getTicketDetails,
  updateTicketStatus,
} from "../../Services/api/tickets";
import { scale } from "react-native-size-matters";
import { colors } from "../../Theme/colors";
import { RootStackParamList, SCREENS } from "../../Navigation/MainNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AppLoader from "../../Components/AppLoader";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import BottomSheetRenderItemForDate from "../Home/BottomSheet/BottomSheetRenderItemForDate";
import BottomSheetRenderItem from "../Home/BottomSheet/BottomSheetRenderItem";
import moment from "moment";
import imagePath from "../../Assets/Images/imagePath";
import { ticketStatusString } from "../../Constants/ticketStatuses";
import DetailsView from "./detailsView";
import { formatAddress } from "./formatAddress";
import { icons } from "../../Assets";
import { FlashList } from "@shopify/flash-list";
import DetailPoint from "./detailsPoint";
import { setStartTime } from "../../Redux/Slicres/ticketDetailSlicer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Details = ({ route }: any) => {
  const allTicketDetails = route?.params?.data;
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [bottomIndex, setBottomIndex] = useState(-1);
  const [notToday, setNotToday] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const today = moment(new Date()).format("YYYY-MM-DD");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["35%", "35%"], []);
  const snapPointsAndroid = useMemo(() => ["30%", "35%"], []);
  const [currentActivityDetails, setCurrentActivityDetails] = useState<any>({});
  const [address, setAddress] = useState<any>();
  const [cancelLoading, setCancelLoading] = useState(false);

  const inProgressTicketDetail: TicketDetailState | any = useSelector(
    (state: any) => state?.ticketDetails?.inProgressTicketDetail
  );
  const taskManagement = useSelector((state: any) => state.taskManagement);

  const scheme = Platform.select({ ios: "maps://", android: "geo:" });
  const latLng = `${currentActivityDetails?.destination_lat},${currentActivityDetails?.destination_long}`;
  const url: any = Platform.select({
    ios: `${scheme}0,0?q=${address}@${latLng}`,
    android: `${scheme}0,0?q=${latLng}(${address})`,
  });

  useEffect(() => {
    setLoading(true);
    getTicketDetails(allTicketDetails?.id)
      .then((res: any) => {
        setLoading(false);
        if (res?.data) {
          setCurrentActivityDetails(res?.data);
          setAddress(
            formatAddress({
              street: res?.data?.street ?? "",
              street2: res?.data?.street2 ?? "",
              city: res?.data?.city ?? "",
              state_id: res?.data?.state_id[1] ?? "",
              zip: res?.data?.zip ?? "",
              country_id: res?.data?.country_id ?? "",
            })
          );
        } else {
        }
      })
      .catch((err: any) => {
        setLoading(false);
        console.log("err", err);
      });
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <View
        {...props}
        style={[
          props.style,
          {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: bottomIndex === -1 ? "none" : "flex",
          },
        ]}
      />
    ),
    [bottomIndex]
  );

  const onPressUploadMedia = () => {
    navigation.navigate(SCREENS.UPLOADMEDIAAFTERTICKETCOMPLETION, {
      ticketId: allTicketDetails?.id,
    });
  };

  const onPressStartTask = () => {
    if (
      moment(allTicketDetails?.activities[0].date_deadline).format(
        "YYYY-MM-DD"
      ) === today
    ) {
      if (
        inProgressTicketDetail?.activityId &&
        inProgressTicketDetail?.activityId !== allTicketDetails?.activityId
      ) {
        bottomSheetRef.current?.snapToIndex(0);
      } else {
        if (!inProgressTicketDetail?.id) {
          let body = {
            activity_id: allTicketDetails?.activityId,
          };
          updateTicketStatus(body)
            .then((res: any) => {})
            .catch((err: any) => {
              console.log("err", err);
            });
          const updatedTicketDetails = {
            ...allTicketDetails,
            name: currentActivityDetails?.name,
            email_from: currentActivityDetails?.email_from,
            phone: currentActivityDetails?.phone,
            partner_name: currentActivityDetails?.partner_name,
            description: currentActivityDetails?.description,
            user_id: currentActivityDetails?.user_id,
            partner_id: currentActivityDetails?.partner_id,
            create_date:
              currentActivityDetails?.activities[0]?.activity_create_date,
            destination: address,
            destination_lat: currentActivityDetails?.destination_lat,
            destination_long: currentActivityDetails?.destination_long,
            x_no_inverter: currentActivityDetails?.x_no_inverter,
            x_type_inverter: currentActivityDetails?.x_type_inverter,
            x_no_battery: currentActivityDetails?.x_no_battery,
            x_type_battery: currentActivityDetails?.x_type_battery,
            x_misc_install: currentActivityDetails?.x_misc_install,
            x_no_panels: currentActivityDetails?.x_no_panels,
            x_type_panel: currentActivityDetails?.x_type_panel,
            x_mount: currentActivityDetails?.x_mount,
            activities: allTicketDetails.activities.map((activity: any) => ({
              ...activity,
              activity_status: "in_progress",
              task_notes: activity?.task_notes
                ? activity?.task_notes?.replace(/<\/?[^>]+(>|$)/g, "")
                : "",
            })),
            survey_doc_attachments:
              currentActivityDetails?.survey_doc_attachments,
          };

          dispatch(setStartTaskTracking(true));
          dispatch(setInProgressTicketDetail(updatedTicketDetails));
          dispatch(updateTime());
          dispatch(setStartTime(new Date()));

          navigation.navigate(SCREENS.CHECKLIST);
        } else {
          if (taskManagement?.installerfeedbackSent) {
            navigation.navigate(SCREENS.CUSTOMERFEEDBACK);
          } else if (taskManagement.isTaskTrackedAndCompleted) {
            navigation.navigate(SCREENS.FEEDBACK);
          } else if (taskManagement.hsCheck) {
            navigation.navigate(SCREENS.TICKETSTATUS);
          } else {
            navigation.navigate(SCREENS.CHECKLIST);
          }
        }
      }
    } else {
      if (allTicketDetails?.activities[0]?.activity_status === "in_progress") {
        if (
          inProgressTicketDetail?.activityId &&
          inProgressTicketDetail?.activityId !== allTicketDetails?.activityId
        ) {
          bottomSheetRef.current?.snapToIndex(0);
        } else {
          if (!inProgressTicketDetail?.id) {
            let body = {
              activity_id: allTicketDetails?.activityId,
            };
            updateTicketStatus(body)
              .then((res: any) => {})
              .catch((err: any) => {
                console.log("err", err);
              });
            const updatedTicketDetails = {
              ...allTicketDetails,
              name: currentActivityDetails?.name,
              email_from: currentActivityDetails?.email_from,
              phone: currentActivityDetails?.phone,
              partner_name: currentActivityDetails?.partner_name,
              description: currentActivityDetails?.description,
              user_id: currentActivityDetails?.user_id,
              partner_id: currentActivityDetails?.partner_id,
              create_date:
                currentActivityDetails?.activities[0]?.activity_create_date,
              destination: address,
              destination_lat: currentActivityDetails?.destination_lat,
              destination_long: currentActivityDetails?.destination_long,
              x_no_inverter: currentActivityDetails?.x_no_inverter,
              x_type_inverter: currentActivityDetails?.x_type_inverter,
              x_no_battery: currentActivityDetails?.x_no_battery,
              x_type_battery: currentActivityDetails?.x_type_battery,
              x_misc_install: currentActivityDetails?.x_misc_install,
              x_no_panels: currentActivityDetails?.x_no_panels,
              x_type_panel: currentActivityDetails?.x_type_panel,
              x_mount: currentActivityDetails?.x_mount,
              activities: allTicketDetails.activities.map((activity: any) => ({
                ...activity,
                activity_status: "in_progress",
                task_notes: activity?.task_notes
                  ? activity?.task_notes?.replace(/<\/?[^>]+(>|$)/g, "")
                  : "",
              })),
              survey_doc_attachments:
                currentActivityDetails?.survey_doc_attachments,
            };

            dispatch(setStartTaskTracking(true));
            dispatch(setInProgressTicketDetail(updatedTicketDetails));
            dispatch(updateTime());
            dispatch(setStartTime(new Date()));

            navigation.navigate(SCREENS.CHECKLIST);
          } else {
            if (taskManagement?.installerfeedbackSent) {
              navigation.navigate(SCREENS.CUSTOMERFEEDBACK);
            } else if (taskManagement.isTaskTrackedAndCompleted) {
              navigation.navigate(SCREENS.FEEDBACK);
            } else if (taskManagement.hsCheck) {
              navigation.navigate(SCREENS.TICKETSTATUS);
            } else {
              navigation.navigate(SCREENS.CHECKLIST);
            }
          }
        }
      } else {
        setNotToday(true);
        bottomSheetRef.current?.snapToIndex(0);
      }
    }
  };
  const renderDescriptionSection = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: scale(15) }}
      >
        <View style={styles.row}>
          <Text style={styles.description}>Ticket Details</Text>

          {allTicketDetails?.activities[0]?.date_done === null && (
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor:
                    allTicketDetails?.activities[0]?.activity_status ===
                      "in_progress" ||
                    allTicketDetails?.activities[0]?.activity_status ===
                      "not_started"
                      ? colors.lightGreen
                      : colors.lightGrey,
                },
              ]}
              onPress={onPressStartTask}
              disabled={
                allTicketDetails?.activities[0]?.activity_status ===
                  "in_progress" ||
                allTicketDetails?.activities[0]?.activity_status ===
                  "not_started"
                  ? false
                  : true
              }
            >
              <Text style={styles.btnText}>
                {
                  ticketStatusString[
                    allTicketDetails?.activities[0]?.activity_status
                  ]
                }
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {allTicketDetails?.activities[0]?.activity_status === "done" &&
          allTicketDetails?.activities[0]?.date_done === null && (
            <TouchableOpacity style={styles.btn1} onPress={onPressUploadMedia}>
              <Text style={styles.btnText}>Upload Media</Text>
            </TouchableOpacity>
          )}

        <View style={styles.divider} />
        <DetailsView
          iconType="MaterialIcons"
          iconName="drive-file-rename-outline"
          heading="Customer Name"
          description={
            currentActivityDetails?.partner_name ||
            currentActivityDetails?.contact_name ||
            ""
          }
        />
        <DetailsView
          iconType="MaterialIcons"
          iconName="email"
          heading="Customer Email"
          description={currentActivityDetails?.email_from ?? ""}
        />
        <DetailsView
          iconType="AntDesign"
          iconName="mobile1"
          heading=" Customer Mobile"
          description={currentActivityDetails?.mobile ?? ""}
        />
        <DetailsView
          iconType="FontAwesome"
          iconName="phone"
          heading=" Customer Phone"
          description={currentActivityDetails?.phone ?? ""}
        />
        <DetailsView
          iconType="FontAwesome"
          iconName="address-book"
          heading="Customer Address"
          description={address}
        />
        <DetailsView
          iconType="MaterialIcons"
          iconName="notes"
          heading="Task Notes"
          description={allTicketDetails?.activities[0]?.task_notes ?? ""}
        />
        <View style={styles.divider} />
        <Text style={styles.description}>Equipment Information</Text>
        <DetailsView
          iconPath={icons.solar}
          heading="Type of Panel"
          description={currentActivityDetails?.x_type_panel ?? ""}
        />
        <DetailsView
          iconPath={icons.box}
          heading="Amount of Panels"
          description={currentActivityDetails?.x_no_panels ?? ""}
        />
        <DetailsView
          iconPath={icons.inverter}
          heading="Inverter"
          description={currentActivityDetails?.x_type_inverter ?? ""}
        />
        <DetailsView
          iconPath={icons.inverter}
          heading="Amount of Inverters"
          description={currentActivityDetails?.x_no_inverter ?? ""}
        />
        <DetailsView
          iconPath={icons.battery}
          heading="Batteries"
          description={currentActivityDetails?.x_type_battery ?? ""}
        />
        <DetailsView
          iconPath={icons.battery}
          heading="Amount of Batteries"
          description={currentActivityDetails?.x_no_battery ?? ""}
        />
        <DetailsView
          iconPath={icons.kit}
          heading="Mounting Kit"
          description={currentActivityDetails?.x_mount ?? ""}
        />
        <DetailPoint
          iconType="MaterialIcons"
          iconName="miscellaneous-services"
          heading="Misc"
          description={currentActivityDetails?.x_misc_install ?? []}
        />

        <DetailsView
          iconPath={icons.document}
          heading="Equipment Notes 1"
          description={currentActivityDetails?.x_equipment_notes_1 ?? ""}
        />
        <DetailsView
          iconPath={icons.document}
          heading="Equipment Notes 2"
          description={currentActivityDetails?.x_equipment_notes_2 ?? ""}
        />

        {currentActivityDetails?.survey_doc_attachments?.length ? (
          <>
            <View style={styles.divider} />
            <Text style={styles.description}>Installation Documents</Text>
            <FlashList
              data={currentActivityDetails?.survey_doc_attachments}
              contentContainerStyle={{ paddingHorizontal: scale(15) }}
              renderItem={({ item }: any) => {
                return (
                  <TouchableOpacity
                    style={styles.btnRow}
                    onPress={() =>
                      navigation.navigate(SCREENS.SURVEYREADER, {
                        pdfInfo: item,
                      })
                    }
                  >
                    <Image source={icons.doc} style={[styles.iconPathStyle]} />
                    <Text
                      style={styles.manualButton}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              estimatedItemSize={100}
            />
          </>
        ) : null}
      </ScrollView>
    );
  };

  const handlePress = () => {
    if (Platform.OS === "ios") {
      setModalVisible(true);
    } else {
      Linking.openURL(url);
    }
  };

  const openMapsWithCoordinates = (mapType: any) => {
    const scheme =
      mapType === "google" ? "comgooglemaps://" : "http://maps.apple.com/";
    const url = Platform.select({
      ios: `${scheme}?q=${latLng}`,
      android: `geo:0,0?q=${latLng}(${address})`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(
          "Maps App Not Installed",
          `It seems ${
            mapType === "google" ? "Google Maps" : "Apple Maps"
          } is not installed on your device. Please install it and try again.`
        );
      }
    });
  };

  const openGoogleMapFromFullData = (data: any) => {
    if (!data) return;

    const { street, street2, zip, city, state_id, country_id } = data;
    const countryName = Array.isArray(country_id) ? country_id[1] : "";

    const fullAddress = `${street || ""} ${street2 || ""} ${zip || ""} ${
      city || ""
    } ${state_id || ""} ${countryName}`.trim();

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      fullAddress
    )}`;

    Linking.openURL(url).catch((err) =>
      console.error("Error opening map:", err)
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        {loading ? (
          <View style={styles.loadingContainer}>
            <AppLoader color={colors?.lightGreen} size={"large"} />
          </View>
        ) : (
          <SafeAreaView
            style={[styles.container, { paddingBottom: insets.bottom }]}
            edges={["top"]}
          >
            <>
              {renderDescriptionSection()}
              <TouchableOpacity
                style={[styles.buttonLocate]}
                onPress={() => {
                  openGoogleMapFromFullData(currentActivityDetails);
                  // handlePress();
                }}
              >
                <Icons
                  iconType="Entypo"
                  name="location-pin"
                  color={colors.white}
                  size={20}
                />
                <Text style={styles.buttonTextLocate}>View In Map</Text>
              </TouchableOpacity>
            </>
          </SafeAreaView>
        )}

        <BottomSheet
          index={bottomIndex}
          snapPoints={
            Platform.OS === "android" ? snapPointsAndroid : snapPoints
          }
          ref={bottomSheetRef}
          backdropComponent={renderBackdrop}
          style={{
            borderRadius: 40,
            elevation: 5,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 10,
          }}
          enablePanDownToClose
          onClose={() => {
            bottomSheetRef?.current?.close(), setNotToday(false);
          }}
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
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                overflow: "hidden",
              }}
            >
              {notToday ? (
                <BottomSheetRenderItemForDate
                  onPress={() => {
                    setNotToday(false);
                    bottomSheetRef?.current?.close();
                  }}
                />
              ) : (
                <BottomSheetRenderItem
                  onPress={() => {
                    bottomSheetRef?.current?.close();
                  }}
                />
              )}
            </View>
          </BottomSheetView>
        </BottomSheet>

        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Choose Map</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "60%",
                  marginVertical: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    openMapsWithCoordinates("google");
                  }}
                >
                  <Image
                    source={imagePath.maps}
                    style={{ height: 50, width: 50 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    openMapsWithCoordinates("apple");
                  }}
                >
                  <Image
                    source={imagePath.apple}
                    style={{ height: 50, width: 50 }}
                  />
                </TouchableOpacity>
              </View>

              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Details;
