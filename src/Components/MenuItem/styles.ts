import {StyleSheet} from 'react-native';
import {colors} from '../../Theme/colors';
import {scale} from 'react-native-size-matters';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.smoke,
    paddingHorizontal: 20,
  },
  imageStyle: {
    alignSelf: 'center',
    marginVertical: '15%',
  },
  box: {
    backgroundColor: colors.white,
    borderRadius: 4,
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
  },
  text: {color: colors.black, marginTop: 3},
  image: {
    height: scale(50),
    width: scale(50),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
  },
  buttonText: {
    color: colors.white,
    width: 80,
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.lightGreen,
    borderRadius: 4,
    alignItems: 'center',
    width: scale(70),
    justifyContent: 'center',
    height: scale(25),
    marginVertical: scale(5),
  },
});
