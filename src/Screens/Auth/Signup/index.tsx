import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icons from "../../../Components/Icons/Icons";
import { colors } from "../../../Theme/colors";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList, SCREENS } from "../../../Navigation/MainNavigator";

const schema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(3, "Username must be at least 3 characters"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email"),
  phoneNo: z
    .string({
      required_error: "Phone number is required",
    })
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),
});

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  SCREENS.LOGIN
>;

export type SignupFormType = z.infer<typeof schema>;

const Signup = () => {
  const navigation = useNavigation<NavigationProp>();
  const [security, setSecurity] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: SignupFormType) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Account created successfully! Please login.", [
        { text: "OK", onPress: () => navigation.navigate(SCREENS.LOGIN) },
      ]);
      console.log("Form Data:", data);
    }, 1500);
  };

  const handleLoginPress = () => {
    navigation.navigate(SCREENS.LOGIN);
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
            <Text style={styles.welcome}>Create Account</Text>
            <Text style={styles.subText}>
              Sign up to get started with your account.
            </Text>

            {/* Username Field */}
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Icons
                iconType="Ionicons"
                name="person-outline"
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
                    placeholder={"Enter Username"}
                    style={styles.inputStyle}
                    placeholderTextColor={colors.lightGrey}
                    autoCapitalize="none"
                  />
                )}
                name="username"
              />
            </View>
            {errors.username && (
              <Text style={styles.errorText}>{errors?.username?.message}</Text>
            )}

            {/* Email Field */}
            <Text style={[styles.label, { marginTop: 15 }]}>Email</Text>
            <View style={styles.inputContainer}>
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
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
                name="email"
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors?.email?.message}</Text>
            )}

            {/* Phone Number Field */}
            <Text style={[styles.label, { marginTop: 15 }]}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Icons
                iconType="Feather"
                name="phone"
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
                    placeholder={"Enter Phone Number"}
                    style={styles.inputStyle}
                    placeholderTextColor={colors.lightGrey}
                    keyboardType="phone-pad"
                  />
                )}
                name="phoneNo"
              />
            </View>
            {errors.phoneNo && (
              <Text style={styles.errorText}>{errors?.phoneNo?.message}</Text>
            )}

            {/* Password Field */}
            <Text style={[styles.label, { marginTop: 15 }]}>Password</Text>
            <View style={styles.inputContainer}>
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

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLoginPress}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.signupButtonText}>Creating Account...</Text>
              ) : (
                <Text style={styles.signupButtonText}>Sign Up</Text>
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

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    color: colors.black,
    fontWeight: "400",
    fontSize: 19.5,
  },
  subText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: "400",
    marginVertical: 3,
  },
  label: {
    color: colors.black,
    marginTop: 10,
    fontSize: 12,
  },
  loginText: {
    color: colors.black,
    fontSize: 13,
    fontWeight: "400",
  },
  inputContainer: {
    borderRadius: 10,
    borderColor: colors.black,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    marginTop: 8,
    paddingHorizontal: 14,
  },
  inputStyle: {
    fontSize: 13,
    color: colors.black,
    height: 40,
    flex: 1,
    marginHorizontal: 6,
  },
  errorText: {
    color: "red",
    paddingHorizontal: 6,
    fontSize: 12,
    marginTop: 2,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 5,
  },
  loginLink: {
    color: "#0066CC",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  signupButton: {
    backgroundColor: colors.lightGreen,
    height: 33,
    marginTop: 14,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonText: {
    color: colors.white,
    fontWeight: "400",
    fontSize: 14,
  },
});
