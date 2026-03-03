import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CustomButton from "../../../Components/Buttons/CustomButton";
import { RootStackParamList, SCREENS } from "../../../Navigation/MainNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { loginUser } from "../../../Services/api/auth";
import { setItem } from "../../../Services/storage";
import { useDispatch, useSelector } from "react-redux";
import { signInUser } from "../../../Redux/Slicres/authSlice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icons from "../../../Components/Icons/Icons";
import { colors } from "../../../Theme/colors";
import { setLoadingLogin } from "../../../Redux/Slicres/authSlice";
import AppLoader from "../../../Components/AppLoader";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

const schema = z.object({
  email: z.string({
    required_error: "Email is required",
  }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(5, "Password must be at least 5 characters"),
});

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  SCREENS.FORGOTPASSWORD,
  SCREENS.HOME
>;

export type FormType = z.infer<typeof schema>;

const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const [security, setSecurity] = useState<boolean>(true);
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const loading = useSelector((state: any) => state?.authData?.loading);
  const onSubmit = (data: FormType) => {
    dispatch(setLoadingLogin(true));
    let body = {
      login: data?.email?.toLowerCase().trim(),
      password: data?.password?.trim(),
    };
    loginUser(body)
      .then(async (res: any) => {
        if (res?.data?.token) {
          console.log(body, res, "dcdcddc");
          await setItem("Token", res?.data?.token);
          dispatch(signInUser(res?.data?.token));
          dispatch(setLoadingLogin(false));
        } else {
          if (res?.code === 401) {
            setError("password", {
              type: "custom",
              message: "Invalid Credentials",
            });
          } else {
            setError("password", {
              type: "custom",
              message: "Something went wrong",
            });
          }
          dispatch(setLoadingLogin(false));
        }
      })
      .catch((err: any) => {
        console.log("err", err);
        setError("password", {
          type: "custom",
          message: "Something went wrong",
        });
        dispatch(setLoadingLogin(false));
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.white }}
      >
        <View style={styles.container}>
          <Image
            source={require("../../../Assets/Images/LogoSub.png")}
            style={{
              alignSelf: "center",
              marginTop: "15%",
              width: scale(110),
              height: scale(70),
            }}
          />

          <View style={styles.con}>
            <Text style={styles.welcome}>Welcome Back!</Text>
            <Text style={styles.loginText}>
              Login to your account and track your task.
            </Text>

            <Text style={styles.email}>Email</Text>
            <View
              style={{
                borderRadius: 10,
                borderColor: colors.black,
                borderWidth: StyleSheet.hairlineWidth,
                flexDirection: "row",
                alignItems: "center",
                height: 40,
                marginTop: 8,
                paddingHorizontal: 14,
              }}
            >
              <Icons
                iconType="Ionicons"
                name="mail-outline"
                color={colors.black}
                size={22}
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={"Enter Email"}
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
            <Text style={[styles.email, { marginTop: 23 }]}>Password</Text>
            <View
              style={{
                borderRadius: 10,
                borderColor: colors.black,
                borderWidth: StyleSheet.hairlineWidth,
                flexDirection: "row",
                alignItems: "center",
                height: scale(40),
                marginTop: 8,
                paddingHorizontal: 14,
              }}
            >
              <Icons
                iconType="Feather"
                name="lock"
                color={colors.black}
                size={22}
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={"Enter Password"}
                    style={styles.inputStyle}
                    placeholderTextColor={colors.lightGrey}
                    secureTextEntry={security}
                  />
                )}
                name="password"
              />
              <TouchableOpacity onPress={() => setSecurity(!security)}>
                <Icons
                  iconType="Ionicons"
                  name={security ? "eye-off-outline" : "eye-outline"}
                  color={colors.black}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors?.password?.message}</Text>
            )}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(SCREENS.FORGOTPASSWORD);
              }}
            >
              <Text
                style={{
                  alignSelf: "flex-end",
                  color: colors.black,
                  fontSize: 12,
                  borderBottomWidth: 1,
                  marginTop: 5,
                  marginRight: 5,
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: colors.lightGreen,
                height: 33,
                marginTop: 14,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleSubmit(onSubmit)}
            >
              {loading ? (
                <AppLoader color={colors.white} />
              ) : (
                <Text style={{ color: colors.white, fontWeight: "400" }}>
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <Image source={require("../../../Assets/Images/Lines.png")} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    color: colors.black,
    fontWeight: "400",
    fontSize: 19.5,
  },
  email: { color: colors.black, marginTop: 10, fontSize: 12 },
  loginText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: "400",
    marginVertical: 3,
  },
  inputStyle: {
    fontSize: 13,
    color: colors.black,
    height: 40,
    flex: 1,
    marginHorizontal: 6,
  },
  login: {
    fontSize: 30,
    textAlign: "center",
    marginTop: "25%",
    fontWeight: "bold",
    color: colors.black,
  },
  errorText: {
    color: "red",
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
});
