import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Pdf from 'react-native-pdf';
import {colors} from '../../Theme/colors';
import {scale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import Icons from '../../Components/Icons/Icons';

const SurveyReader = ({route}:any) => {
  const {pdfInfo} = route.params;
  const [pdfError, setPdfError] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons
            iconType='MaterialIcons'
            name='arrow-back'
            color={colors.black}
            size={scale(20)}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{pdfInfo?.name}</Text>
      </View>
      
      {pdfError ? (
        <Text style={styles.errorText}>
          Failed to load the PDF. Please try again later.
        </Text>
      ) : (
        <Pdf
          source={{uri: pdfInfo?.url, cache: true}}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log('Error loading PDF', error);
            setPdfError(true); // Set error state if PDF fails to load
          }}
          style={styles.pdf}
          trustAllCerts={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingVertical: scale(20),
    backgroundColor: colors.white,
  },
  headerText: {
    fontSize: scale(18),
    color: colors.black,
    marginLeft: scale(10),
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: scale(15),
    paddingVertical: scale(15),
  },
  errorText: {
    fontSize: scale(16),
    color: colors.black,
    textAlign: 'center',
    padding: scale(20),
  },
});

export default SurveyReader;
