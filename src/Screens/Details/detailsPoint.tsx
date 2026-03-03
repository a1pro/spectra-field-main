import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icons from '../../Components/Icons/Icons';
import {colors} from '../../Theme/colors';
import {scale} from 'react-native-size-matters';

interface DetailPointProps {
  iconType?: any;
  iconName?: any;
  heading: string;
  description: any;
}

const DetailPoint: React.FC<DetailPointProps> = ({
  iconType,
  iconName,
  heading,
  description,
}) => {
  return (
    <View style={styles.rowSub}>
      <View style={{marginTop: scale(3)}}>
        <Icons
          iconType={iconType}
          name={iconName}
          color={colors.black}
          size={scale(12)}
        />
      </View>
      <View style={styles.rowText}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.headingSub}>{heading} :</Text>
          {description?.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: scale(5),
              }}>
              <View style={styles.bulletPoint}></View>
              <Text style={styles.headingSub1}>{description[0]}</Text>
            </View>
          )}
        </View>

        <View style={{marginLeft: scale(51)}}>
          {description?.length > 0 &&
            description.slice(1).map((item: any, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: scale(5),
                }}>
                <View style={styles.bulletPoint}></View>
                <Text style={styles.headingSub1}>{item}</Text>
              </View>
            ))}
        </View>
      </View>
    </View>
  );
};

export default DetailPoint;

const styles = StyleSheet.create({
  rowSub: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: scale(10),
    paddingHorizontal: scale(15),
    width: scale(330),
  },
  headingSub: {
    color: colors.black,
    fontWeight: '600',
    fontSize: scale(14),
    marginLeft: scale(8),
    textAlign: 'justify',
  },
  headingSub1: {
    color: colors.black,
    fontWeight: '400',
    fontSize: scale(13),
  },
  rowText: {},
  bulletPoint: {
    backgroundColor: colors.black,
    height: scale(10),
    width: scale(10),
    borderRadius: scale(5),
    marginRight: scale(5),
  },
});
