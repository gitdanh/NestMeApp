import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Image } from "react-native";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileDetails from "../components/Profile/ProfileDetails";
import ProfilePosts from "../components/Profile/ProfilePosts";
import { StatusBar } from "expo-status-bar";
function Profile(props) {

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <ProfileHeader/>
        <ProfileDetails/>
        <ProfilePosts/>
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