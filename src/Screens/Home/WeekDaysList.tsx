import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import moment from 'moment';
import {colors} from '../../Theme/colors';
import { scale } from 'react-native-size-matters';

const WeekDaysList = ({
  selectedDate,
  onPress,
  dates,
  todayIndex,
}: any): JSX.Element => {
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth / 9;
  const flatListRef = useRef<FlatList<string>>(null);
  useEffect(() => {
    if (flatListRef.current && todayIndex !== -1) {
      setTimeout(() => {
        flatListRef?.current?.scrollToIndex({
          index: 14,
          animated: true,
        });
      }, 0);
    }
  }, [todayIndex]);

  const getItemLayout = (data: any, index: number) => ({
    length: itemWidth,
    offset: itemWidth * index,
    index,
  });

  return (
    <View style={styles.list}>
      <FlatList
        data={dates}
        ref={flatListRef}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.dateButton,
              item === selectedDate && styles.selectedDate,
              {width: itemWidth},
            ]}
            onPress={() => onPress(item)}>
            <Text
              style={[
                styles.dayText,
                item === selectedDate && styles.selectedText,
              ]}>
              {moment(item).format('ddd')}
            </Text>
            <Text
              style={[
                styles.dateText,
                item === selectedDate && styles.selectedText,
              ]}>
              {moment(item).format('D')}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        scrollEnabled={true}
        contentContainerStyle={styles.flatListContent}
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        initialScrollIndex={todayIndex}
      />
    </View>
  );
};

export default WeekDaysList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  inputStyle: {
    backgroundColor: 'transparent',
    fontSize: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
    marginBottom: 20,
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 48,
    marginTop: 10,
  },
  login: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: '25%',
    fontWeight: 'bold',
  },
  con: {marginTop: 80, flex: 1},
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    width: 115,
    backgroundColor: colors.white,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 30,
    alignContent: 'center',
  },
  buttonText: {
    color: colors.black,
    fontSize: 14,
    marginRight: 7,
  },
  flatListContent: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  dateButton: {
    padding: scale(9),
    marginVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
    height: 65,
    paddingTop: 15,
  },
  selectedDate: {
    backgroundColor: colors.lightGreen,
  },
  selectedText: {
    color: colors.white,
  },
  dayText: {
    fontSize: 10,
    color: colors.black,
    marginBottom: 4,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
  },
  list: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 15,
  },
});
