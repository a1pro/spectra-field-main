import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import Icons from '../../Components/Icons/Icons';
import { colors } from '../../Theme/colors';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { RootStackParamList } from '../../Navigation/MainNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = Buffer.from(base64, 'base64').toString('binary');
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const DocumentReader = ({ route }: any) => {
  const data = route?.params?.data;
  const sourceUrl = data;
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<any>(null);

  const navigation = useNavigation<NavigationProp>();

  const [filePath, setFilePath] = useState(
    `${RNFS.DocumentDirectoryPath}/react-native.pdf`,
  );

  useEffect(() => {
    if (data) {
      downloadFile();
    }
  }, [data]);

  const downloadFile = async () => {
    try {
      const res = await RNFS.downloadFile({
        fromUrl: sourceUrl,
        toFile: filePath,
      }).promise;
      setTimeout(async () => {
        const pdfData = await RNFS.readFile(filePath, 'base64');
        setPdfArrayBuffer(base64ToArrayBuffer(pdfData));
        setFileDownloaded(true);
      }, 1000);
    } catch (error) {
      console.error('___downloadFile -> Error downloading file', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{ margin: 20, zIndex: 100 }}
      >
        <Icons iconType="Ionicons" name="arrow-back" size={25} />
      </TouchableOpacity>
      {!fileDownloaded ? (
        <View style={styles.indicator}>
          <ActivityIndicator color={colors.lightGreen} size="large" />
        </View>
      ) : (
        <>
          <View style={{ flex: 1 }}>
            <Pdf
              minScale={1.0}
              maxScale={1.0}
              scale={1.0}
              spacing={0}
              fitPolicy={0}
              enablePaging={true}
              source={{ uri: filePath }}
              onLoadComplete={(
                numberOfPages,
                filePath,
                { width, height },
              ) => {}}
              onError={error => {
                console.log('here error is ', error);
              }}
              style={styles.pdf}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingBottom: scale(10),
  },
  pdf: {
    width: Dimensions.get('window').width,

    flex: 1,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
    zIndex: 1,
    justifyContent: 'center',
  },
});

export default DocumentReader;
