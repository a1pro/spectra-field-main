import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import CustomButton from '../../../Components/Buttons/CustomButton';
import {RootStackParamList, SCREENS} from '../../../Navigation/MainNavigator';
import {colors} from '../../../Theme/colors';
import {scale} from 'react-native-size-matters';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {verifyOTP} from '../../../Services/api/auth';
import {useNavigation} from '@react-navigation/native';
import showToast from '../../../Hooks/show-toast';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CELL_COUNT = 6;

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  SCREENS.RESETPASSWORD
>;

const OTP = ({route}: any) => {
  const userEmail = route?.params?.email;

  const navigation = useNavigation<NavigationProp>();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const onPressVerify = (value: any) => {
    setLoading(true);
    const body: any = {
      email: userEmail,
      otp: value,
    };
    verifyOTP(body)
      .then(async (res: any) => {
        setLoading(false);
        if (res?.data) {
          navigation.navigate(SCREENS.RESETPASSWORD, {email: userEmail});
          showToast({
            type: 'success',
            text1: 'Success',
            text2: 'OTP successfully verified',
          });
        } else {
          showToast({
            type: 'error',
            text1: 'Warning',
            text2: 'OTP verification failed.',
          });
        }
      })
      .catch((err: any) => {
        setLoading(false);
        showToast({
          type: 'error',
          text1: 'Warning',
          text2: 'Something went wrong',
        });
      });
  };

  const maskEmail = (email: any) => {
    const [username, domain] = email.split('@');
    if (username.length <= 2) {
      return `${username}*****@${domain}`;
    }
    const maskedUsername =
      username[0] +
      '********'.slice(0, username.length - 2) +
      username[username.length - 1];
    return `${maskedUsername}@${domain}`;
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: colors.white}}>
        <View style={styles.main}>
          <Image
            source={require('../../../Assets/Images/LogoSub.png')}
            style={styles.image}
          />
          <View style={styles.upperView}>
            <Text style={styles.login}>OTP Verification</Text>
            <Text
              style={
                styles.emailText
              }>{`Please enter verification code we have sent on your email ${maskEmail(
              userEmail,
            )}`}</Text>

            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              testID="my-code-input"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
            <CustomButton
              title={'Verify'}
              disabled={value?.length !== CELL_COUNT}
              onPress={() => onPressVerify(value)}
              labelStyle={{color: colors.white}}
              style={styles.button}
              loading={loading}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <Image source={require('../../../Assets/Images/Lines.png')} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTP;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
  },
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
  inputStyle: {
    backgroundColor: 'transparent',
    fontSize: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
    marginBottom: 20,
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 48,
    marginTop: 10,
  },
  login: {
    fontSize: scale(20),

    marginTop: '8%',
    fontWeight: 'bold',
    color: colors.black,
  },
  emailText: {
    fontSize: scale(15),
    fontWeight: '400',
    color: colors.black,
    marginTop: scale(5),
    lineHeight: scale(20),
  },
  con: {marginTop: 80, flex: 1},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: scale(40),
    height: scale(40),
    lineHeight: scale(38),
    fontSize: scale(24),
    borderWidth: scale(2),
    borderColor: '#00000030',
    textAlign: 'center',
    borderRadius: scale(7),
    color: colors.black,
  },
  focusCell: {
    borderColor: '#000',
  },
  image: {
    alignSelf: 'center',
    marginTop: '25%',
    width: scale(110),
    height: scale(70),
  },
  button: {
    marginTop: scale(25),
  },
  upperView: {
    backgroundColor: colors.white,
    marginHorizontal: scale(20),
    paddingHorizontal: scale(10),
    marginTop: scale(20),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    height: scale(250),
    borderRadius: scale(5),
  },
});
