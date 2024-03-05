import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Image } from "react-native";
import ProfileHeader from "../components/ProfileHeader";
import ProfileDetails from "../components/ProfileDetails";
import ProfilePosts from "../components/ProfilePosts";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/FontAwesome";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconFeather from "react-native-vector-icons/Feather";
function Profile(props) {

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <ProfileHeader/>
        <ProfileDetails/>
        <ProfilePosts/>
        {/* <View style={styles.footer}>
          <Icon color={"#ffff"} size={25} name="home" />
          <Icon color={"gray"} size={25} name="search" />
          <Icon color={"gray"} size={25} name="plus-square" />
          <IconFeather color={"gray"} size={25} name="log-out" />
        </View> */}
      </View>
    </>
  );
}

export default Profile;

export const styles = StyleSheet.create({
    container: {
      display: "flex",
      flex: 1,
      backgroundColor: "black",
      padding: "0 20",
    },
  });