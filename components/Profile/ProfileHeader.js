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
import { CommonActions } from "@react-navigation/native";
import { logoutUser } from "../../store/redux/slices/authSlice";
import * as conversationService from "../../services/conversationService";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ProfileHeader = ({ navigation, userId, username, isOwnProfile }) => {
  const dispatch = useDispatch();

  const authUserId = useSelector((state) => state.authenticate.userId);
  const avatar = useSelector((state) => state.authenticate.avatar);
  const user = {
    _id: authUserId,
    avatar: avatar,
  };

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

  const handleMessage = async () => {
    try {
      const newConversation = {
        userIds: [user._id, userId],
      };
      const con = await conversationService.createConversation(newConversation);

      if (con) {
        navigation.navigate("Chat");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReport = async () => {};

  const openActions = () => {
    const actions = [
      isOwnProfile
        ? {
            text: "Change password",
            onPress: () => navigation.navigate("ChangePass"),
          }
        : {
            text: "Report",
            onPress: handleReport,
            style: "destructive",
          },
      {
        text: "Cancle",
        style: "cancel",
      },
    ];

    if (isOwnProfile) {
      actions.push({
        text: "Log out",
        onPress: handleLogout,
        style: "destructive",
      });
    } else {
      actions.push({
        text: "Message",
        onPress: handleMessage,
      });
    }

    Alert.alert("Actions", "Which actions do you want?", actions);
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
        {!isOwnProfile && (
          <IconMaterialCommunityIcons
            color={"white"}
            size={30}
            name="keyboard-backspace"
            style={{ marginRight: 10 }}
            onPress={() => navigation.goBack()}
          />
        )}
        <Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
          {" "}
          {username}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconFeather
            color={"white"}
            size={25}
            name="menu"
            onPress={openActions}
          />
        </View>
      </View>
      {/* <Modal
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
      </Modal> */}
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
