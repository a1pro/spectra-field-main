import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
} from "react-native";
import Icons from "../../Components/Icons/Icons";
import { colors } from "../../Theme/colors";
import LinearGradient from "react-native-linear-gradient";
import styles from "./style"; // Reuse the styles from the main file
import { scale } from "react-native-size-matters";
import ViewShot from "react-native-view-shot";
import { ScrollView } from "react-native-gesture-handler";
interface UploadMediaProps {
  ticketDetails: any;
  getLocation: () => void;
  viewShotRef: any;
}

const UploadMedia: React.FC<UploadMediaProps> = ({
  ticketDetails,
  getLocation,
  viewShotRef,
}) => {
  const reversedData = ticketDetails?.offlineimages.slice().reverse();
  return (
    <View style={{ marginHorizontal: 20 }}>
      <TouchableOpacity style={styles.upload} onPress={getLocation}>
        <Icons iconType="Entypo" name="upload" color={colors.black} size={22} />
        <Text
          style={{ marginTop: scale(3), fontSize: 18, color: colors.black }}
        >
          Upload Media
        </Text>
      </TouchableOpacity>

      {ticketDetails?.photo.length > 0 ? (
        <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
          <ImageBackground
            source={{ uri: ticketDetails?.photo[0].uri }}
            resizeMode="center"
            style={styles.imageBackground}
          >
            <LinearGradient
              colors={["transparent", "transparent"]}
              style={styles.gradient}
            >
              <View style={styles.con}>
                <Text style={styles.timestamp}>
                  {ticketDetails?.timeString}
                </Text>
                <Text style={styles.coordinates}>
                  Latitude: {ticketDetails?.location?.latitude}, Longitude:{" "}
                  {ticketDetails?.location.longitude}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </ViewShot>
      ) : ticketDetails?.offlineimages.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
        >
          {reversedData.map((item: any) => {
            return (
              <Image
                source={{ uri: item?.uri }}
                style={{
                  height: 100,
                  width: 100,
                  marginRight: 10,
                }}
              />
            );
          })}
        </ScrollView>
      ) : (
        ""
      )}
    </View>
  );
};

export default UploadMedia;
