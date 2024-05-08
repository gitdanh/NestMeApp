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
import useHttpClient from "../axios/public-http-hook";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
export default function ChangePass(props) {
    const [formData, setFormData] = useState({
        oldpw: "",
        newpw: "",
        repeatpw: "",
      });
    
      const [isValid, setIsValid] = useState(true);

      const handleChangeText = (name, value) => {
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={container.center}>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 30 }}>
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
              onChangeText={(value) => handleChangeText("newpw", value)}
            />
            <TextInput
              style={form.textInput}
              placeholder="Repeat Password"
              placeholderTextColor="gray"
              secureTextEntry={true}
              onChangeText={(value) => handleChangeText("repeatpw", value)}
            />

            <PrimaryButton
              onPress={() => {
                console.log("Register button pressed");
              }}
            >
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