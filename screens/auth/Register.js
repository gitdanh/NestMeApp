import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import { container, form } from "../../styles/authStyle";
import PrimaryButton from "../../components/button/PrimaryButton";
import useHttpClient from "../../axios/public-http-hook";
const logo = require("../../assets/logo-white.png");
export default function Register(props) {
  const pulicHttpRequest = useHttpClient();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullname: '',
    username: '',
    otpToken:'',
    otp:'',
  });
  const [isValid, setIsValid] = useState(true);

  const handleChangeText = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const sendOTP = async () => {
    const { email, password, fullname, username } = formData;
    if (!email || !password || !fullname || !username) {
      Alert.alert('Error', 'Please fill out everything');
      return;
    }
  
    if (password.length < 6) {
      Alert.alert('Error', 'Passwords must be at least 6 characters');
      return;
    }
    try {
    const url = `/auth/signup/${(username)}/${(email)}`;
    const response = pulicHttpRequest.publicRequest(
        url,
        "get",
    );
    console.log(url)
    console.log((await response).status + 'concac');
    
    const otpToken = (await response).data.otpToken;
    const formWithOtpToken = { ...formData, otpToken };
    props.navigation.navigate('VerifyOTP', {formData: formWithOtpToken});
  
    } catch (error) {
      //console.error('Error registering:', error);
      Alert.alert('Error', 'Email already exists or not valid email format');
      setIsValid({
        bool: true,
        boolSnack: true,
        //message: 'Error registering. Please try again.',
      });
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
              keyboardType="twitter"
              onChangeText={(value) => handleChangeText("username", value)}
            />
            <TextInput
              style={form.textInput}
              placeholder="Name"
              placeholderTextColor="gray"
              onChangeText={(value) => handleChangeText("fullname", value)}
            />
            <TextInput
              style={form.textInput}
              placeholder="Email"
              placeholderTextColor="gray"
              onChangeText={(value) => handleChangeText("email", value)}
            />
            <TextInput
              style={form.textInput}
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry={true}
              onChangeText={(value) => handleChangeText("password", value)}
            />

            <PrimaryButton onPress={() => {
                console.log("Register button pressed");
                sendOTP();
            }}>
                Register
            </PrimaryButton>
          </KeyboardAvoidingView>
        </View>

        <View style={form.bottomButton}>
          <Text
            style={{ color: "white", width: "auto", textAlign: "center" }}
            onPress={() => props.navigation.replace("VerifyOTP")}
          >
            Already have an account? SignIn.
          </Text>
        </View>
        {isValid.bool && (
        <Text style={{ color: 'red' }}>{isValid.message}</Text>
      )}

      </View>
    </TouchableWithoutFeedback>
  );
}
