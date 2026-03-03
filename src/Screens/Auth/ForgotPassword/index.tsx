import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
} from 'react-native';
import {RootStackParamList, SCREENS} from '../../../Navigation/MainNavigator';
import {colors} from '../../../Theme/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {scale} from 'react-native-size-matters';
import AppLoader from '../../../Components/AppLoader';
import Icons from '../../../Components/Icons/Icons';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {EmailBody, sendEmailToBackend} from '../../../Services/api/auth';
import showToast from '../../../Hooks/show-toast';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  SCREENS.OTP
>;

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
});

export type FormType = z.infer<typeof schema>;

const ForgotPassword = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    setError,
    formState: {errors},
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: EmailBody) => {
    let newData: EmailBody = {
      email: data?.email?.toLowerCase() || '',
    };
    setLoading(true);
    sendEmailToBackend(newData)
      .then(async (res: any) => {
        if (res?.data) {
          showToast({
            type: 'success',
            text1: 'Success',
            text2: 'Otp sent on Email',
          });

          navigation.navigate(SCREENS.OTP, {email: data?.email});
        } else {
          setError('email', {
            type: 'custom',
            message: 'Email not found',
          });
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        setError('email', {
          type: 'custom',
          message: 'Something went wrong please try again',
        });
      });
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: colors.white}}>
        <View style={styles.container}>
          <Image
            source={require('../../../Assets/Images/LogoSub.png')}
            style={{
              alignSelf: 'center',
              marginTop: '15%',
              width: scale(110),
              height: scale(70),
            }}
          />

          <View style={styles.con}>
            <Text style={styles.welcome}>Forgot Password</Text>
            <Text style={styles.loginText}>
              Provide your account's email for which you want to reset your
              password !
            </Text>

            <Text style={styles.email}>Email</Text>
            <View style={styles.input}>
              <Icons
                iconType="Ionicons"
                name="mail-outline"
                color={colors.black}
                size={22}
              />
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={'Enter Email'}
                    style={styles.inputStyle}
                    placeholderTextColor={colors.lightGrey}
                  />
                )}
                name="email"
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors?.email?.message}</Text>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: colors.lightGreen,
                height: 33,
                marginTop: 14,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handleSubmit(onSubmit)}>
              {loading ? (
                <AppLoader color={colors.white} />
              ) : (
                <Text style={{color: colors.white, fontWeight: '400'}}>
                  Send OTP
                </Text>
              )}
            </TouchableOpacity>
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

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    color: colors.black,
    fontWeight: '600',
    fontSize: scale(18),
  },
  email: {color: colors.black, marginTop: 10, fontSize: 12},
  loginText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '400',
    marginVertical: 3,
  },
  inputStyle: {
    fontSize: scale(13),
    color: colors.black,
    flex: 1,
    backgroundColor: colors.white,
  },
  login: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: '25%',
    fontWeight: 'bold',
    color: colors.black,
  },
  errorText: {
    color: 'red',
    paddingHorizontal: 6,
    fontSize: 12,
  },
  con: {
    marginTop: scale(30),
    backgroundColor: colors.white,
    padding: 10,
    paddingHorizontal: 12,
    marginHorizontal: 13,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  input: {
    borderRadius: scale(10),
    borderColor: colors.black,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 14,
    height: scale(40),
  },
});
