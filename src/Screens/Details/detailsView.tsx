import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Icons from '../../Components/Icons/Icons';
import {colors} from '../../Theme/colors';
import {scale} from 'react-native-size-matters';

interface DetailsViewProps {
  iconType?: any;
  iconName?: any;
  iconPath?: any;
  heading: string;
  description: string;
  textStyle?:any
}

const DetailsView: React.FC<DetailsViewProps> = ({
  iconType,
  iconName,
  heading,
  description,
  iconPath,
  textStyle
}) => {
  return (
    <View style={styles.rowSub}>
      {iconPath ? (
        <Image source={iconPath} style={[styles.iconPathStyle]} />
      ) : (
        <View style={{marginTop: scale(3)}}>
          <Icons
            iconType={iconType}
            name={iconName}
            color={colors.black}
            size={scale(12)}
          />
        </View>
      )}

      <View style={styles.rowText}>
        <Text style={[styles.headingSub,textStyle]}>{heading} : 
          <Text style={styles.headingSub1}> {description}</Text>
        </Text>
      </View>
    </View>
  );
};

export default DetailsView;

const styles = StyleSheet.create({
  rowSub: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: scale(10),
    paddingHorizontal: scale(15),
    width:scale(330)
  },
  headingSub: {
    color: colors.black,
    fontWeight: '600',
    fontSize: scale(14),
    marginLeft: scale(8),
  },
  headingSub1: {
    color: colors.black,
    fontWeight: '400',
    fontSize: scale(13),
    flexShrink: 1,
  },
  rowText: {
    flexDirection: 'row',
  },
  iconPathStyle: {
    alignSelf: 'flex-start',
    height: scale(16),
    width: scale(16),
    marginTop: scale(2),
  },
});
