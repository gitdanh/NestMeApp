import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Keyboard,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { container, form } from "../../styles/authStyle";
import useHttpClient from "../../axios/public-http-hook";
import PrimaryButton from "../../components/button/PrimaryButton";
import OTPInput from "../../components/OTPInput/OTPInput";

export default function VerifyOTPResetPassword({ navigation, route }) {
  const pulicHttpRequest = useHttpClient();
  const [otp, setOTP] = useState("");
  const { otpToken } = route.params;
  const [resetToken, setResetToken] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [password, setPassword] = useState("");

  const handleVerifyOTP = async () => {
    if (otp === "") {
      Alert.alert("Error", "Please enter OTP");
      return;
    }
    const formOTP = { otpToken, otp };

    try {
      const response = await pulicHttpRequest.publicRequest(
        "/auth/mverifyResetOtp",
        "post",
        formOTP,
        { headers: { "Content-type": "application/json" } }
      );
      if (response.data.reset_token || response.data.reset_token !== "") {
        setResetToken(response.data.reset_token);
        setIsOtpVerified(true);
      }
    } catch (err) {
      //console.error('Error registering:', error);
      setIsOtpVerified(false);
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    if (password === "") {
      Alert.alert("Error", "Please enter new password!");
      return;
    }
    const formNewPassword = { resetToken, password };

    if (!resetToken || resetToken === "") {
      setIsOtpVerified(false);
      return;
    }

    try {
      const response = await pulicHttpRequest.publicRequest(
        "/auth/reset-password",
        "patch",
        formNewPassword,
        { headers: { "Content-type": "application/json" } }
      );
      if (response.data.message) {
        navigation.navigate("Login");
      }
    } catch (err) {
      console.log("Error reset:", err);
      Alert.alert("Error", "Error while reset password, please try again!");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        {!isOtpVerified ? (
          <>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              Please enter OTP:
            </Text>
            <OTPInput
              length={6}
              value={otp}
              disabled={pulicHttpRequest.isLoading}
              onChange={setOTP}
            />
            <PrimaryButton
              onPress={handleVerifyOTP}
              overwriteTextStyle={{ fontSize: 20 }}
            >
              Verify OTP
            </PrimaryButton>
          </>
        ) : (
          <>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              Enter new password:
            </Text>
            <TextInput
              style={[form.textInput, { width: "90%" }]}
              placeholder="New password"
              placeholderTextColor="gray"
              secureTextEntry={true}
              onChangeText={(value) => setPassword(value)}
            />
            <PrimaryButton
              onPress={handleChangePassword}
              overwriteTextStyle={{ fontSize: 20 }}
            >
              Change password
            </PrimaryButton>
          </>
        )}

        <Button title="Cancel" onPress={handleCancel} />
      </View>
    </TouchableWithoutFeedback>
  );
}
