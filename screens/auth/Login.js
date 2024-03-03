import React, { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import PrimaryButton from "../../components/button/PrimaryButton";
import { container, form } from "../../styles/authStyle";

const logo = require("../../assets/logo-white.png");

const UsersCanLogin = [
  { username: "danhnt", password: "123456" },
  { username: "duongnk", password: "1234" },
];

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = async () => {
    const user = UsersCanLogin.find((user) => user.username === username);
    console.log("Nhan login");

    if (user && user.password === password) {
      // Đăng nhập thành công
    } else {
      // Đăng nhập thất bại
      console.log("Đăng nhập thất bại");
    }
  };
  return (
    <View style={container.center}>
      <View style={container.formCenter}>
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
          onChangeText={(username) => setUsername(username)}
        />
        <TextInput
          style={form.textInput}
          placeholder="Password"
          placeholderTextColor="gray"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <PrimaryButton onPress={onSignIn}>Sign In</PrimaryButton>
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
  );
}