import React from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { CommonActions, useNavigation } from '@react-navigation/native';
import { logoutUser } from "../../store/redux/slices/authSlice";

const ProfileHeader = ({ username }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            console.log("OK Pressed");
            try {
                await AsyncStorage.removeItem("refreshToken");
                dispatch(logoutUser()); // Gọi action creator để xóa access token từ Redux store
                console.log("refreshToken removed successfully");
            } catch (error) {
                console.error("Error removing refreshToken:", error);
                // Handle error, perhaps show a message to the user
            }
          },
        },
      ],
      { cancelable: false }
    );
  }
  return (
    <View
      style={{
        paddingHorizontal: 15,
        paddingTop: 30,
        height: 62,
        marginBottom: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
          {" "}
          {username}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            color={"white"}
            size={25}
            name="plus-square"
            style={{ marginRight: 10 }}
          />
          <IconFeather color={"white"} size={25} name="menu" onPress={handleLogout}/>
        </View>
      </View>
    </View>
  );
};
export default ProfileHeader;
