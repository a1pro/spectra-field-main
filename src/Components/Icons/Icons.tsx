import { ColorValue } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Zocial from "react-native-vector-icons/Zocial";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

export type IconType =
  | "FontAwesome6"
  | "FontAwesome5"
  | "AntDesign"
  | "Entypo"
  | "EvilIcons"
  | "Feather"
  | "FontAwesome"
  | "Fontisto"
  | "Ionicons"
  | "Foundation"
  | "MaterialIcons"
  | "Zocial"
  | "Foundation"
  | "Octicons"
  | "SimpleLineIcons"
  | "MaterialCommunityIcons";

/**
 * benifits no need to import evry time for  diffret types icon
 * @param props icons types , icons name, icon size, icon colors
 * @returns returns vector icons,
 */

/* eslint-disable-next-line */
export interface IconsProps {
  iconType: IconType;
  name: string;
  size: number;
  color?: ColorValue | number | undefined;
  onPress?: () => void | undefined;
}

export function Icons(props: IconsProps) {
  const { iconType, name, size, color, onPress } = props;

  switch (iconType) {
    case "FontAwesome6":
      return (
        <FontAwesome6 name={name} size={size} color={color} onPress={onPress} />
      );
    case "FontAwesome5":
      return (
        <FontAwesome5 name={name} size={size} color={color} onPress={onPress} />
      );
    case "AntDesign":
      return (
        <AntDesign name={name} size={size} color={color} onPress={onPress} />
      );
    case "Entypo":
      return <Entypo name={name} size={size} color={color} onPress={onPress} />;
    case "EvilIcons":
      return (
        <EvilIcons name={name} size={size} color={color} onPress={onPress} />
      );
    case "Feather":
      return (
        <Feather name={name} size={size} color={color} onPress={onPress} />
      );
    case "FontAwesome":
      return (
        <FontAwesome name={name} size={size} color={color} onPress={onPress} />
      );
    case "Fontisto":
      return (
        <Fontisto name={name} size={size} color={color} onPress={onPress} />
      );
    case "Foundation":
      return (
        <Foundation name={name} size={size} color={color} onPress={onPress} />
      );
    case "Ionicons":
      return (
        <Ionicons name={name} size={size} color={color} onPress={onPress} />
      );
    case "MaterialIcons":
      return (
        <MaterialIcons
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      );
    case "Octicons":
      return (
        <Octicons name={name} size={size} color={color} onPress={onPress} />
      );
    case "MaterialCommunityIcons":
      return (
        <MaterialCommunityIcons
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      );
    case "Zocial":
      return <Zocial name={name} size={size} color={color} onPress={onPress} />;
    case "SimpleLineIcons":
      return (
        <SimpleLineIcons
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      );
    default:
      return null;
  }
}

export default Icons;
