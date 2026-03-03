import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import Icons from '../../Components/Icons/Icons';
import {colors} from '../../Theme/colors';

type WeekListParams = {
  onPress: (subItem: any) => void;
  events?: any[];
};

const DayList = ({onPress, events}: WeekListParams) => {
  const Item = ({subItem}: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onPress(subItem);
      }}>
      <View style={styles.border}>
        <View style={styles.row}>
          <Text style={styles.name}>{subItem.name}</Text>
          <Text style={styles.time}>{subItem.time}</Text>
        </View>

        <View style={[styles.row, {marginTop: 10}]}>
          <View style={styles.rowSub}>
            <Icons
              iconType="Ionicons"
              name="person"
              color={colors.darkGreen}
              size={12}
            />
            <Text style={styles.text}>{subItem.person}</Text>
          </View>
          <View style={styles.rowSub}>
            <Icons
              iconType="Ionicons"
              name="navigate"
              color={colors.darkGreen}
              size={14}
            />
            <Text style={styles.text}>{subItem.address}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Start Task</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({item}: any) => (
    <View>
      <View style={styles.center}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.dayText}>{item.day}</Text>
      </View>

      {item.items.map((subItem: any) => (
        <Item key={subItem.id} subItem={subItem} />
      ))}
    </View>
  );

  return (
    <>
      <Text>Day List</Text>
      <FlatList
        data={events}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={{marginTop: 10}}
        keyExtractor={item => item.date}
      />
    </>
  );
};

export default DayList;

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
  item: {backgroundColor: colors.white, borderRadius: 10, marginBottom: 10},
  border: {
    borderLeftWidth: 2,
    borderLeftColor: colors.lightGreen,
    margin: 12,
    paddingLeft: 12,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  center: {flexDirection: 'row', alignItems: 'center', marginTop: 10},
  text: {
    color: colors.darkGreen,
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 6,
  },
  name: {color: colors.black, fontSize: 14, fontWeight: '500'},
  time: {color: colors.black, fontSize: 12, fontWeight: '400'},
  rowSub: {flexDirection: 'row'},
  btnText: {fontSize: 14, color: colors.white, fontWeight: '400'},
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
