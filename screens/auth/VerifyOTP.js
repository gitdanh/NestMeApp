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
import useHttpClient from "../../axios/public-http-hook";
import PrimaryButton from "../../components/button/PrimaryButton";
import OTPInput from "../../components/OTPInput/OTPInput";
export default function VerifyOTP({ navigation, route }) {
  const pulicHttpRequest = useHttpClient();
  const [otp, setOTP] = useState("");
  const { formData } = route.params;

  const handleVerifyOTP = async () => {
    if (otp === "") {
      Alert.alert("Error", "Please enter OTP");
      return;
    }
    const formWithOTP = { ...formData, otp };

    try {
      const response = await pulicHttpRequest.publicRequest(
        "/auth/signup",
        "post",
        formWithOTP,
        { headers: { "Content-type": "application/json" } }
      );
      if (response.data) {
        navigation.navigate("Login");
      }
    } catch (error) {
      //console.error('Error registering:', error);
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  const handleCancel = () => {
    console.log("Cancel button pressed");
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
        {/* <TextInput
          maxLength={6}
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: 7,
            width: 200,
            borderColor: "#262626",
            borderRadius: 10,
            borderWidth: 1,
            marginVertical: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
          onChangeText={(text) => setOTP(text)}
          value={otp}
          keyboardType="numeric"
        /> */}
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
        <Button title="Cancel" onPress={handleCancel} />
      </View>
    </TouchableWithoutFeedback>
  );
}
