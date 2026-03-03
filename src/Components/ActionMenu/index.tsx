import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Easing,
  GestureResponderEvent,
  Image,
} from 'react-native';
import {scale} from 'react-native-size-matters';

interface ActionMenuProps {
  icon?: any;
  onPress?: (event: GestureResponderEvent) => void;
  buttonBackgroundColor?: string;
  iconBackgroundColor?: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  icon,
  onPress,
  buttonBackgroundColor = 'red',
  iconBackgroundColor = 'blue',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleLogout = () => {
    setIsVisible(!isVisible);
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 0 : 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.roundIcon, {backgroundColor: iconBackgroundColor}]}
        onPress={event => {
          toggleLogout();
          if (onPress) {
            onPress(event);
          }
        }}>
        <Image source={icon} />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.animatedView,
          {
            opacity: fadeAnim,
            backgroundColor: buttonBackgroundColor,
            transform: [
              {
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}>
        <Text style={styles.logoutText}>Logout</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  roundIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  iconText: {
    color: 'white',
    fontWeight: 'bold',
  },
  animatedView: {
    padding: scale(5),
    borderRadius: 5,
    position: 'absolute',
    left: 90,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ActionMenu;
