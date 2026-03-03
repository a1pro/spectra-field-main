import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Menu } from 'react-native-paper';
import styles from './style';
import Icons from '../../Components/Icons/Icons';
import { colors } from '../../Theme/colors';
import { scale } from 'react-native-size-matters';
import { HomeScreenState } from '../../Redux/Slicres/homeScreenSlicer';
import { useSelector } from 'react-redux';
import moment from 'moment';

type HeaderParams = {
  dropDownVisibility: boolean;
  onPressCalendar: () => void;
  selectedMode: string;
  onPressDropDown: () => void;
  onPressMode: (item: any) => void;
  calendarDate: string;
};

const RenderMainHeader = ({
  dropDownVisibility,
  onPressCalendar,
  selectedMode,
  onPressDropDown,
  onPressMode,
  calendarDate,
}: HeaderParams) => {
  //Store state
  const homeScreenDetails: HomeScreenState = useSelector(
    (state: any) => state.homeData,
  );
  return (
    <View style={styles.containerRow}>
      <Image
        source={require('../../Assets/Images/Logo.png')}
        style={{ width: scale(78), height: scale(41) }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Menu
          visible={dropDownVisibility}
          onDismiss={onPressDropDown}
          contentStyle={{ backgroundColor: colors.white }}
          anchor={
            <TouchableOpacity
              onPress={onPressDropDown}
              style={[styles.button, { width: 90 }]}
            >
              <Text style={[styles.buttonText]}>{selectedMode}</Text>
              <Icons
                iconType="Entypo"
                name="chevron-small-down"
                size={25}
                color={colors.black}
              />
            </TouchableOpacity>
          }
        >
          <Menu.Item
            titleStyle={{ color: colors.black }}
            onPress={() => onPressMode('List')}
            title="List"
          />
          <Menu.Item
            titleStyle={{ color: colors.black }}
            onPress={() => onPressMode('Month')}
            title="Month"
          />
        </Menu>
        {homeScreenDetails?.selectedMode === 'List' && (
          <TouchableOpacity
            onPress={onPressCalendar}
            style={[styles.button, { marginLeft: 10 }]}
          >
            <Text style={styles.buttonText}>
              {calendarDate !== ''
                ? moment(calendarDate).format('DD-MM-YYYY')
                : 'Pick a Date'}
            </Text>
            <Icons
              iconType="FontAwesome5"
              name="calendar-alt"
              color={colors.black}
              size={12}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default RenderMainHeader;
