import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { logoutUser } from "../../store/redux/slices/authSlice";

const ProfileHeader = ({ props, username }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("refreshToken");
              dispatch(logoutUser());
            } catch (error) {
              console.error("Error removing refreshToken:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const [modalVisible, setModalVisible] = useState(false);
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
          <IconFeather
            color={"white"}
            size={25}
            name="menu"
            onPress={() => setModalVisible(true)}
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                borderBottomColor: "#a8a8a8",
                borderBottomWidth: 1,
                width: 200,
                padding: 10,
              }}
            >
              <IconAnt
                style={{ marginLeft: 150 }}
                color={"white"}
                size={27}
                name="close"
                onPress={() => setModalVisible(!modalVisible)}
              />
            </View>
            <Text
              style={[
                styles.modalText,
                { borderBottomColor: "#a8a8a8", borderBottomWidth: 1 },
              ]}
              onPress={() => navigation.navigate("ChangePass")}
            >
              Change Password
            </Text>
            <Text style={styles.modalText} onPress={handleLogout}>
              Log Out
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "black",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    width: 200,
    padding: 20,
    color: "white",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 15,
  },
});
export default ProfileHeader;
