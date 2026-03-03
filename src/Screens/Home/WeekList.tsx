import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { EVENT } from '../../Redux/Slicres/homeScreenSlicer';
import moment from 'moment';
import AppLoader from '../../Components/AppLoader';
import { scale } from 'react-native-size-matters';
import { colors } from '../../Theme/colors';
import { useSelector } from 'react-redux';
import { ticketStatusString } from '../../Constants/ticketStatuses';

type WeekListParams = {
  onPress: (subItem: any) => void;
  events?: EVENT[];
  eventLoader: boolean;
};
const WeekList = ({ onPress, events, eventLoader }: WeekListParams) => {
  const inProgressTicketDetail: any = useSelector(
    (state: any) => state?.ticketDetails?.inProgressTicketDetail,
  );

  const Item = ({ subItem }: any) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          onPress(subItem);
        }}
      >
        <View
          style={[
            styles.border,
            {
              borderLeftColor:
                inProgressTicketDetail?.activityId ===
                  subItem?.activities[0]?.id ||
                ticketStatusString[subItem?.activities[0]?.activity_status] ===
                  'Ticket In Progress'
                  ? colors.red
                  : subItem?.activities[0]?.activity_status === 'cancelled'
                  ? colors?.lightGrey
                  : colors.lightGreen,
            },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.name, { width: '45%' }]}>{subItem?.name}</Text>
            <Text style={[styles.time]}>
              {moment(subItem?.activities[0]?.due_datetime).format(
                'dddd DD-MM-YYYY : HH:mm',
              )}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor:
                  inProgressTicketDetail?.activityId ===
                    subItem?.activities[0]?.id ||
                  ticketStatusString[
                    subItem?.activities[0]?.activity_status
                  ] === 'Ticket In Progress'
                    ? colors.red
                    : subItem?.activities[0]?.activity_status === 'cancelled'
                    ? colors?.lightGrey
                    : colors.lightGreen,
              },
            ]}
            onPress={() => {
              onPress(subItem);
            }}
          >
            <Text style={styles.btnText}>
              {subItem?.activities[0]?.activity_status !== 'not_started'
                ? subItem?.activities[0]?.date_done == null
                  ? ticketStatusString[subItem?.activities[0]?.activity_status]
                  : 'Done'
                : 'View Ticket'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  const renderItem = ({ item }: any) => {
    return (
      <View>
        <View style={styles.center}>
          <Text style={styles.dateText}>
            {moment(item[0]).format('DD-MM-YYYY')}
          </Text>
        </View>
        {/* {item[1]?.map((subItem: any, index: any) => (
          <Item key={index} subItem={subItem} />
        ))} */}
        {[...item[1]]
          ?.sort(
            (a, b) =>
              new Date(a.due_datetime).getTime() -
              new Date(b.due_datetime).getTime(),
          )
          .map((subItem: any, index: any) => (
            <Item key={index} subItem={subItem} />
          ))}
      </View>
    );
  };

  const renderRooter = () => {
    return (
      <View style={styles.noTicket}>
        <Text style={styles.dateText}>No Tickets Found</Text>
      </View>
    );
  };

  return (
    <View style={styles.listView}>
      {eventLoader ? (
        <AppLoader color={colors?.lightGreen} size={'large'} />
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 10 }}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={renderRooter}
          contentContainerStyle={{ flex: 1 }}
        />
      )}
    </View>
  );
};

export default WeekList;

const styles = StyleSheet.create({
  dateText: {
    color: colors.black,
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '500',
  },
  dayText: {
    color: colors.black,
    fontSize: 17,
    marginBottom: 10,
    fontWeight: '300',
    marginLeft: 5,
  },
  item: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 10,
    width: scale(310),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 5,
  },
  border: {
    borderLeftWidth: 2,
    margin: 12,
    paddingLeft: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  center: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  text: {
    color: colors.darkGreen,
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 6,
  },
  name: { color: colors.black, fontSize: 14, fontWeight: '500' },
  time: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '400',
    marginRight: scale(10),
  },
  rowSub: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btnText: { fontSize: 14, color: colors.white, fontWeight: '400' },
  btn: {
    borderRadius: 5,
    width: scale(150),
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  description: {
    marginTop: 10,
  },
  noTicket: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headingSub: {
    color: colors.darkGreen,
    fontWeight: '500',
    fontSize: scale(12),
    marginVertical: scale(7),
  },
});
