import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SCREENS } from "../../Navigation/MainNavigator";
import { colors } from "../../Theme/colors";
import imagePath from "../../Assets/Images/imagePath";
import { setScreen } from "../../Redux/Slicres/bottomScreen";
import { useDispatch, useSelector } from "react-redux";

export function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const tabBarVisible = useSelector((state: any) => state.bottom.tabBarVisible);
  if (!tabBarVisible) return null;
  const dispatch = useDispatch();

  return (
    <View style={[styles.mainContainer, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        let labelName, imagesName;
        const isFocused = state.index === index;

        switch (route.name) {
          case SCREENS.DASHBOARD:
            labelName = "Home";
            imagesName = imagePath.Home;

            break;
          case SCREENS.DOCUMENT:
            labelName = "Document";
            imagesName = imagePath.Doc;
            break;
          case SCREENS.MEDIA:
            labelName = "Media";
            imagesName = imagePath.Gallary;
            break;
          default:
            labelName = "Phone";
            imagesName = imagePath.Phone;
            break;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          dispatch(setScreen(route.name));
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={label} style={styles.tab} onPress={onPress}>
            <Image
              source={imagesName}
              style={[
                styles.imageStyle,
                { tintColor: isFocused ? colors.lightGreen : colors.black },
              ]}
            />
            <Text
              style={[
                styles.tabText,
                { color: isFocused ? colors.lightGreen : colors.black },
              ]}
            >
              {labelName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    alignItems: "center",
    marginTop: 8,
    width: "33%",
    flex: 1,
  },
  tabText: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
    fontWeight: "500",
  },
  imageStyle: {
    height: 18,
    width: 18,
  },
  mainContainer: {
    flexDirection: "row",
    borderTopColor: colors.white,
    borderTopWidth: 1,
    backgroundColor: colors.white,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    zIndex: 10,
  },
});
