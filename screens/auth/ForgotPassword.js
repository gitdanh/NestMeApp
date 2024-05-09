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
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setAccessToken } from "../../store/redux/slices/authSlice";
import PrimaryButton from "../../components/button/PrimaryButton";
import { container, form } from "../../styles/authStyle";
import useHttpClient from "../../axios/public-http-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
const logo = require("../../assets/logo-white.png");

export default function ForgotPassword(props) {
  const pulicHttpRequest = useHttpClient();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState("");

  const handleChangeText = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const onSubmit = async () => {
    if (!loading) {
      if (!formData) {
        Alert.alert("Error", "Email or username is empty!");
        return;
      }
      try {
        setLoading(true);
        const response = await pulicHttpRequest.publicRequest(
          "/auth/mforgot-password",
          "post",
          { usernameOrEmail: formData },
          { headers: { "Content-type": "application/json" } }
        );

        if (response.data.otp_token) {
          props.navigation.navigate("VerifyOTPResetPassword", {
            otpToken: response.data.otp_token,
          });
          setLoading(false);
        }
      } catch (err) {
        Alert.alert("Lỗi", err.message);
        setLoading(false);
      }
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
            enabled={Platform.OS === "ios"}
          >
            {/* <View
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
            </View> */}
            <Text
              style={{
                color: "white",
                fontSize: 30,
                fontWeight: 600,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Have some problem when login?
            </Text>
            <TextInput
              style={form.textInput}
              placeholder="Email or username"
              placeholderTextColor="gray"
              onChangeText={(value) => setFormData(value)}
            />

            <PrimaryButton onPress={onSubmit} isLoading={loading}>
              Submit
            </PrimaryButton>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                textTransform: "uppercase",
                marginTop: 20,
              }}
              onPress={() => props.navigation.goBack()}
            >
              Back to login
            </Text>
          </KeyboardAvoidingView>
        </View>

        <View style={form.bottomButton}>
          <Text
            style={{
              color: "white",
              width: "auto",
              textAlign: "center",
              textTransform: "uppercase",
            }}
            title="Register"
            onPress={() => props.navigation.replace("Register")}
          >
            Create new account!
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
