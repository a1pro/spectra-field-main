import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import {
  CalendarTouchableOpacityProps,
  ICalendarEventBase,
} from 'react-native-big-calendar';
import Icons from '../../Components/Icons/Icons';
import { colors } from '../../Theme/colors';
interface EventType extends ICalendarEventBase {
  status: string;
  startHour: any;
  endHour?: any;
  title: string;
  children: any;
}

export const RenderEvent = <T extends EventType>(
  event: T,
  touchableOpacityProps: CalendarTouchableOpacityProps,
) => {
  return (
    <TouchableOpacity {...touchableOpacityProps}>
      <View style={styles.item}>
        <View style={styles.border}>
          <View style={styles.row}>
            <Text style={styles.name}>{event?.title}</Text>
            {/* <Text style={styles.time}>{event?.time}</Text> */}
          </View>

          {event?.children && (
            <View style={[styles.row, { marginTop: 10 }]}>
              <View style={styles.rowSub}>
                <Icons
                  iconType="Ionicons"
                  name="person"
                  color={colors.darkGreen}
                  size={12}
                />
                <Text style={styles.text}>{event?.children?.person}</Text>
              </View>
              <View style={styles.rowSub}>
                <Icons
                  iconType="Ionicons"
                  name="navigate"
                  color={colors.darkGreen}
                  size={14}
                />
                <Text style={styles.text}>{event?.children?.address}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
  item: { backgroundColor: colors.white, borderRadius: 10 },
  border: {
    borderLeftWidth: 2,
    borderLeftColor: colors.lightGreen,
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
  time: { color: colors.black, fontSize: 12, fontWeight: '400' },
  rowSub: { flexDirection: 'row' },
  btnText: { fontSize: 14, color: colors.white, fontWeight: '400' },
  btn: {
    backgroundColor: colors.lightGreen,
    borderRadius: 5,
    width: 79,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
});
