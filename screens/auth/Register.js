import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { container, form } from "../../styles/authStyle";
import PrimaryButton from "../../components/button/PrimaryButton";

const logo = require("../../assets/logo-white.png");
export default function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(true);

  const onRegister = () => {
    if (
      name.lenght == 0 ||
      username.lenght == 0 ||
      email.length == 0 ||
      password.length == 0
    ) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "Please fill out everything",
      });
      return;
    }
    if (password.length < 6) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "passwords must be at least 6 characters",
      });
      return;
    }
    if (password.length < 6) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "passwords must be at least 6 characters",
      });
      return;
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
          value={username}
          keyboardType="twitter"
          onChangeText={(username) =>
            setUsername(
              username
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "")
                .replace(/[^a-z0-9]/gi, "")
            )
          }
        />
        <TextInput
          style={form.textInput}
          placeholder="Name"
          placeholderTextColor="gray"
          onChangeText={(name) => setName(name)}
        />
        <TextInput
          style={form.textInput}
          placeholder="Email"
          placeholderTextColor="gray"
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={form.textInput}
          placeholder="Password"
          placeholderTextColor="gray"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <PrimaryButton onPress={onRegister}>Register</PrimaryButton>
      </View>

      <View style={form.bottomButton}>
        <Text
          style={{ color: "white", width: "auto", textAlign: "center" }}
          onPress={() => props.navigation.replace("Login")}
        >
          Already have an account? SignIn.
        </Text>
      </View>
      {/* <Snackbar
        visible={isValid.boolSnack}
        duration={2000}
        onDismiss={() => {
          setIsValid({ boolSnack: false });
        }}
      >
        {isValid.message}
      </Snackbar> */}
    </View>
  );
}
