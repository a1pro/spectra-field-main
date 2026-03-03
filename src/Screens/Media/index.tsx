import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../Theme/colors";
import { useFocusEffect } from "@react-navigation/native";
import { getMediaAttachments } from "../../Services/api/attachments";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { scale } from "react-native-size-matters";
import { TicketDetailState } from "../../Redux/Slicres/ticketDetailSlicer";
import ImageViewer from "react-native-image-zoom-viewer";
import Modal from "react-native-modal";
import Orientation from "react-native-orientation-locker";
import { Image as RNImage } from "react-native";

const Media = () => {
  const ticketId: TicketDetailState = useSelector(
    (state: any) => state?.ticketDetails?.inContextTicketId,
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [rotation, setRotation] = useState(0); // Will always be 0 now

  useFocusEffect(
    React.useCallback(() => {
      if (ticketId) {
        setLoading(true);
        getMediaAttachments(ticketId)
          .then((res: any) => {
            // console.log('res?.data', res?.data);
            if (Array.isArray(res?.data)) {
              setData(res?.data);
            } else {
              setData([]);
            }
            setLoading(false);
          })
          .catch((error: any) => {
            console.log("error in getting all media", error);
            setLoading(false);
          });
      }
      return () => {
        setData([]);
      };
    }, [ticketId]),
  );

  // Function to open image viewer
  const openImageViewer = (index: number) => {
    const imgUrl = data[index]?.url;
    if (imgUrl) {
      RNImage.getSize(
        imgUrl,
        (width, height) => {
          if (width > height) {
            Orientation.lockToLandscape();
          } else {
            Orientation.lockToPortrait();
          }
          setSelectedImageIndex(index);
          setIsViewerVisible(true);
        },
        () => {
          Orientation.lockToPortrait();
          setSelectedImageIndex(index);
          setIsViewerVisible(true);
        },
      );
    } else {
      Orientation.lockToPortrait();
      setSelectedImageIndex(index);
      setIsViewerVisible(true);
    }
  };

  // Restore orientation when modal closes
  useEffect(() => {
    if (!isViewerVisible) {
      Orientation.lockToPortrait();
    }
  }, [isViewerVisible]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../Assets/Images/Logo.png")}
        style={styles.img}
      />
      {data.length > 0 && <Text style={styles.text}>Media</Text>}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
        </View>
      ) : data.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            {data.map((item: any, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => openImageViewer(index)}
              >
                <Image
                  key={item.id}
                  style={styles.image}
                  source={{ uri: item.url }}
                  // resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Text style={styles.text}>
            {ticketId
              ? data.length <= 0 && "No Media Found"
              : "No Ticket Selected"}
          </Text>
        </View>
      )}
      {/* Modal for image viewer */}
      <Modal
        isVisible={isViewerVisible}
        onBackdropPress={() => {
          setIsViewerVisible(false);
        }}
        style={{ margin: 0 }}
        useNativeDriver
      >
        <ImageViewer
          key={selectedImageIndex}
          imageUrls={data.map((item: any) => ({ url: item.url }))}
          index={selectedImageIndex}
          onSwipeDown={() => {
            setIsViewerVisible(false);
          }}
          enableSwipeDown
          renderImage={(props) => (
            <Image
              {...props}
              style={{
                width: "100%",
                height: "100%",
                transform: [{ rotate: `0deg` }],
              }}
              resizeMode="cover"
            />
          )}
          onCancel={() => {
            setIsViewerVisible(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default Media;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  img: {
    height: 70,
    width: 130,
    alignSelf: "center",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    marginLeft: 5,
    marginVertical: scale(10),
    alignSelf: "center",
    color: colors.black,
    fontWeight: "500",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  image: {
    width: scale(99),
    height: scale(100),
    marginVertical: scale(2),
    backgroundColor: colors.lightGrey,
    marginHorizontal: scale(2),
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 130,
  },
});
