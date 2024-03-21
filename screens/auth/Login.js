import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setAccessToken } from "../../store/redux/slices/authSlice";
import PrimaryButton from "../../components/button/PrimaryButton";
import { container, form } from "../../styles/authStyle";
import useHttpClient from "../../axios/public-http-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRefreshToken } from "../../axios/refresh-token";
const logo = require("../../assets/logo-white.png");

const UsersCanLogin = [
  { username: "danhnt", password: "123456" },
  { username: "duongnk", password: "1234" },
];

export default function Login(props) {
  const pulicHttpRequest = useHttpClient();

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChangeText = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const onSignIn = async () => {
    try {
      const response = await pulicHttpRequest.publicRequest(
        "/auth/mlogin",
        "post",
        formData,
        { headers: { "Content-type": "application/json" } }
      );
      if (response.status !== 200) {
        throw new Error("Đăng nhập thất bại");
      }

      dispatch(setAccessToken(response.data.accessToken));
      AsyncStorage.setItem("refreshToken", response.data.refreshToken);
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={container.center}>
        <View style={container.formCenter}>
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: "center" }}
            behavior="position"
            keyboardVerticalOffset={-70}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  width: "52%",
                  height: 45,
                  marginBottom: 30,
                  margin: 0,
                }}
                source={logo}
              />
            </View>

            <TextInput
              style={form.textInput}
              placeholder="Username"
              placeholderTextColor="gray"
              onChangeText={(value) => handleChangeText("username", value)}
            />
            <TextInput
              style={form.textInput}
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry={true}
              onChangeText={(value) => handleChangeText("password", value)}
            />

            <PrimaryButton onPress={onSignIn}>Sign In</PrimaryButton>
          </KeyboardAvoidingView>
        </View>

        <View style={form.bottomButton}>
          <Text
            style={{ color: "white", width: "auto", textAlign: "center" }}
            title="Register"
            onPress={() => props.navigation.replace("Register")}
          >
            Don't have an account? SignUp.
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
