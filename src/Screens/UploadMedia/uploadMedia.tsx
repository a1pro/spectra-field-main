import React from "react";
import { View, TouchableOpacity, Text, ImageBackground } from "react-native";
import Icons from "../../Components/Icons/Icons";
import { colors } from "../../Theme/colors";
import LinearGradient from "react-native-linear-gradient";
import { scale } from "react-native-size-matters";
import ViewShot from "react-native-view-shot";
import styles from "./style";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface UploadMediaProps {
  openUploadOptions: () => void;
  viewShotRef: any;
  photos: any;
  locationCords: any;
}

const UploadMedia: React.FC<UploadMediaProps> = ({
  openUploadOptions,
  viewShotRef,
  photos,
  locationCords,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        marginHorizontal: scale(20),
        marginTop: scale(10),
        paddingBottom: insets.bottom || scale(10), // ensure content sits above navigation bar
      }}
    >
      <TouchableOpacity style={styles.upload} onPress={openUploadOptions}>
        <Icons iconType="Entypo" name="upload" color={colors.black} size={22} />
        <Text
          style={{ marginTop: scale(3), fontSize: 18, color: colors.black }}
        >
          Upload Media
        </Text>
      </TouchableOpacity>

      {photos.length !== 0 && (
        <ViewShot
          ref={viewShotRef}
          options={{ format: "jpg", quality: 0.9 }}
          style={{ paddingBottom: insets.bottom || scale(10) }}
        >
          <ImageBackground
            source={{ uri: photos[0].uri }}
            resizeMode="cover"
            style={[
              styles.imageBackground,
              { paddingBottom: insets.bottom || scale(10) },
            ]}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.gradient}
            >
              <View style={styles.con}>
                <Text style={styles.timestamp}>
                  {new Date().toLocaleString()}
                </Text>
                <Text style={styles.coordinates}>
                  Latitude: {locationCords?.latitude}, Longitude:{" "}
                  {locationCords?.longitude}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </ViewShot>
      )}
    </View>
  );
};

export default UploadMedia;
