import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import Pdf from "react-native-pdf";
const PDF = () => {
  const source = {
    uri: "http://samples.leanpub.com/thereactnativebook-sample.pdf",
    cache: true,
  };
  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
  );
};
export default PDF;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 25,
    backgroundColor: "#f4f4f4",
  },
  pdf: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
