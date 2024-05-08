import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { container, form } from "../styles/authStyle";
import PrimaryButton from "../components/button/PrimaryButton";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import usePrivateHttpClient from "../axios/private-http-hook";
import { updateUserPassword } from "../services/userService";
import { logoutUser } from "../store/redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

export default function ChangePass(props) {
  const { privateRequest } = usePrivateHttpClient();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    oldpw: "",
    newpw: "",
    repeatpw: "",
  });

  const [updatePassLoading, setUpdatePassLoading] = useState(false);

  const [isValid, setIsValid] = useState(true);

  const handleChangeText = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updatePass = async () => {
    if (
      !(
        formData.oldpw === "" &&
        formData.newpw === "" &&
        formData.repeatpw === ""
      )
    ) {
      if (formData.newpw !== formData.repeatpw) {
        Alert.alert("Repeat password not equal to new password!");
        return;
      }
      setUpdatePassLoading(true);
      try {
        const response = await updateUserPassword(
          { oldPass: formData.oldpw, newPass: formData.newpw },
          privateRequest
        );

        if (response.message) {
          Alert.alert(response.message);
          setUpdatePassLoading(false);
          dispatch(logoutUser());
          await AsyncStorage.removeItem("refreshToken");
          setUpdatePassLoading(false);
        }
      } catch (err) {
        Alert.alert(err.message);
        setUpdatePassLoading(false);
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
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 30 }}
        >
          <IconMaterialCommunityIcons
            color={"white"}
            size={30}
            name="keyboard-backspace"
            style={{ marginRight: 10 }}
            onPress={() => {
              props.navigation.navigate("Profile");
            }}
          />
        </View>
        <View style={container.formCenter}>
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: "center" }}
            behavior="position"
            keyboardVerticalOffset={-70}
          >
            <TextInput
              style={form.textInput}
              placeholder="Old Password"
              placeholderTextColor="gray"
              keyboardType="twitter"
              onChangeText={(value) => handleChangeText("oldpw", value)}
            />
            <TextInput
              style={form.textInput}
              placeholder="New Password"
              placeholderTextColor="gray"
              secureTextEntry={true}
              onChangeText={(value) => handleChangeText("newpw", value)}
            />
            <TextInput
              style={form.textInput}
              placeholder="Repeat Password"
              placeholderTextColor="gray"
              secureTextEntry={true}
              onChangeText={(value) => handleChangeText("repeatpw", value)}
            />

            <PrimaryButton onPress={updatePass} isLoading={updatePassLoading}>
              Change
            </PrimaryButton>
          </KeyboardAvoidingView>
        </View>
        {isValid.bool && (
          <Text style={{ color: "red" }}>{isValid.message}</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
