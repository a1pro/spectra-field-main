import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import WeekDaysList from "./WeekDaysList";
import WeekList from "./WeekList";
import {
  HomeScreenState,
  setCalendarDateInStore,
  setEventInStore,
  setEventLoader,
  setSelectedModeInStore,
  setWeekDaysHeader,
  setEventForCalenderInStore,
  resetHomeScreenStore,
} from "../../Redux/Slicres/homeScreenSlicer";
import styles from "./style";
import RenderMainHeader from "./renderMainHeader";
import {
  cancelTicket,
  getAllTickets,
  TICKET,
} from "../../Services/api/tickets";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, SCREENS } from "../../Navigation/MainNavigator";
import { Calendar } from "react-native-big-calendar";
import { setInContextTicketId } from "../../Redux/Slicres/ticketDetailSlicer";
import { transformDataByActivityDate } from "../../Helper/UtilityFunctions/transformLeadsToTasks";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const Home = () => {
  //Hooks
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();

  //Store state
  const homeScreenDetails: HomeScreenState = useSelector(
    (state: any) => state.homeData
  );

  //Local States
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [dropDownVisibility, setDropDownVisibility] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const flatListRef = useRef(null);
  const today = moment(new Date()).format("YYYY-MM-DD");
  const preview: any = useSelector(
    (state: any) => state?.ticketDetails?.preview
  );
  useEffect(() => {
    const generateDates = (startDate: any) => {
      const futureDates = Array.from({ length: 15 }, (_, i) =>
        moment(startDate).add(i, "days").format("YYYY-MM-DD")
      );
      const pastDates = Array.from({ length: 15 }, (_, i) =>
        moment(startDate)
          .subtract(i + 1, "days")
          .format("YYYY-MM-DD")
      ).reverse();
      return [...pastDates, ...futureDates];
    };
    const datesList = generateDates(
      homeScreenDetails?.selectedPickerDate || new Date()
    );
    dispatch(setWeekDaysHeader(datesList));
  }, [homeScreenDetails?.selectedPickerDate]);

  useFocusEffect(
    React.useCallback(() => {
      if (!preview) {
        dispatch(setInContextTicketId("")); //That's for refreshing  media screen that's been populated once we navigated to details
      }
      dispatch(setEventLoader(true));
      let body: TICKET = {
        startDate:
          homeScreenDetails?.selectedMode === "List"
            ? homeScreenDetails?.selectedPickerDateFormatted
            : moment().startOf("month").format("YYYY-MM-DD"),
        endDate:
          homeScreenDetails?.selectedMode === "List"
            ? moment().add(1, "days").format("YYYY-MM-DD")
            : moment().endOf("month").format("YYYY-MM-DD"),
      };

      getAllTickets(body)
        .then((res: any) => {
          dispatch(setEventLoader(false));
          const allTickets = Object.entries(res?.data?.leads_by_date);
          const groupedData = transformDataByActivityDate(
            Object.entries(res?.data?.leads_by_date)
          );
          const filteredData = groupedData.filter(
            ([date]) => date === body.startDate
          );

          dispatch(setEventLoader(false));
          // if (allTickets?.length) {
          //   const calendarDataArray = allTickets
          //     .map(([date, tickets]: any) => {
          //       return tickets?.map((ticket: any) => {
          //         const assignDate = new Date(
          //           ticket?.activities[0]?.date_deadline,
          //         );
          //         return {
          //           ...ticket,
          //           title: ticket.name,
          //           start: assignDate,
          //           end: assignDate,
          //         };
          //       });
          //     })
          //     .flat();

          //   dispatch(setEventInStore(filteredData));
          //   dispatch(setEventForCalenderInStore(calendarDataArray));
          // }

          if (allTickets && allTickets.length) {
            const calendarDataArray = allTickets
              .flatMap(([date, tickets]: any) =>
                tickets?.flatMap((ticket: any) =>
                  ticket?.activities?.map((activity: any) => {
                    const assignDate = new Date(activity?.date_deadline);
                    if (isNaN(assignDate.getTime())) return null;

                    return {
                      ...ticket,
                      title: ticket.name ?? "Untitled Ticket",
                      start: assignDate,
                      end: assignDate,
                    };
                  })
                )
              )
              .filter(Boolean);

            dispatch(setEventInStore(filteredData));
            dispatch(setEventForCalenderInStore(calendarDataArray));
          }
        })
        .catch((error: any) => {
          dispatch(setEventLoader(false));
          console.log("error in getting all tickets", error);
        });

      return () => {};
    }, [
      homeScreenDetails?.selectedPickerDateFormatted,
      homeScreenDetails?.selectedMode,
    ])
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(resetHomeScreenStore());
      };
    }, [])
  );

  useEffect(() => {
    if (preview) {
      navigation.navigate(SCREENS.CUSTOMERFEEDBACK);
    }
  }, [preview]);

  const onPressDropDown = () => {
    setDropDownVisibility(!dropDownVisibility);
  };

  const handleTicketPress = (data: any) => {
    if (preview) {
      navigation.navigate(SCREENS.CUSTOMERFEEDBACK);
    } else {
      dispatch(setInContextTicketId(data?.id));
      navigation.navigate(SCREENS.DETAILS, { data });
    }
  };

  const CustomEventComponent = (event: { title: any; count: any }) => {
    const { title, count } = event;
    return (
      <>
        <TouchableOpacity
          style={styles.event}
          onPress={() => {
            handleTicketPress(event);
          }}
        >
          <Text style={{ fontSize: 12, color: "#000" }} numberOfLines={1}>
            {title}
          </Text>
        </TouchableOpacity>
        {count > 1 && (
          <TouchableOpacity style={styles.eventCount}>
            <Text style={{ fontSize: 10, color: "#000" }}>
              {`+${count - 1} more`}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  const eventsForCalendar = useMemo(() => {
    const groupedEvents = homeScreenDetails?.eventsForCalender?.reduce(
      (acc, event) => {
        if (!event?.start) return acc; // Skip events with null start date

        const eventDate = new Date(event.start);
        if (isNaN(eventDate.getTime())) return acc; // Ensure valid date

        const eventDateString = eventDate.toISOString().split("T")[0];

        if (!acc[eventDateString]) {
          acc[eventDateString] = [];
        }
        acc[eventDateString].push(event);
        return acc;
      },
      {} as Record<string, any[]>
    );

    return Object.values(groupedEvents ?? [])?.map((events) => {
      const [firstEvent] = events;
      return {
        ...firstEvent,
        title: firstEvent?.title ?? "Untitled Event",
        count: events.length,
      };
    });
  }, [homeScreenDetails?.eventsForCalender, homeScreenDetails?.selectedMode]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <RenderMainHeader
        dropDownVisibility={dropDownVisibility}
        onPressDropDown={onPressDropDown}
        selectedMode={homeScreenDetails?.selectedMode}
        calendarDate={homeScreenDetails?.selectedPickerDateFormatted}
        onPressMode={(item) => {
          dispatch(setSelectedModeInStore(item));
          setDropDownVisibility(false);
          if (homeScreenDetails?.selectedPickerDateFormatted != item) {
            dispatch(setEventInStore([]));
            dispatch(setEventForCalenderInStore([]));
          }
        }}
        onPressCalendar={() => setOpenDatePicker(!openDatePicker)}
      />
      {homeScreenDetails?.selectedMode === "List" ? (
        <>
          <WeekDaysList
            selectedDate={homeScreenDetails?.selectedPickerDateFormatted}
            onPress={(item: any) => {
              dispatch(setCalendarDateInStore(item));
              if (homeScreenDetails?.selectedPickerDateFormatted != item) {
                dispatch(setEventInStore([]));
                dispatch(setEventForCalenderInStore([]));
              }
            }}
            dates={homeScreenDetails?.weekDays}
            todayIndex={homeScreenDetails?.weekDays.indexOf(
              moment(homeScreenDetails?.selectedPickerDate).format("YYYY-MM-DD")
                ? moment(homeScreenDetails?.selectedPickerDate).format(
                    "YYYY-MM-DD"
                  )
                : today
            )}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <WeekList
              onPress={(data) => {
                handleTicketPress(data);
              }}
              events={homeScreenDetails?.events}
              eventLoader={homeScreenDetails?.eventLoader}
            />
          </ScrollView>
        </>
      ) : (
        <Calendar
          events={eventsForCalendar}
          height={600}
          renderEvent={CustomEventComponent}
          mode="month"
          swipeEnabled={true}
          dayHeaderHighlightColor="red"
          weekDayHeaderHighlightColor="red"
          allDayEventCellTextColor="red"
        />
      )}

      <DatePicker
        modal
        open={openDatePicker}
        date={new Date()}
        mode="date"
        onConfirm={(date) => {
          setOpenDatePicker(false);
          dispatch(setCalendarDateInStore(date.toISOString()));
        }}
        onCancel={() => setOpenDatePicker(false)}
      />
    </SafeAreaView>
  );
};

export default Home;
