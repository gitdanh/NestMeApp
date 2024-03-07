import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Image } from "react-native";
import Feed from "../components/Feed";
import Footer from "../components/Footer";
import Icon from "react-native-vector-icons/FontAwesome";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconFeather from "react-native-vector-icons/Feather";
import { StatusBar } from "expo-status-bar";

function Home(props) {
  //const { loginUser } = props.route.params;

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../assets/logo-white.png")}
          />
          <View style={styles.headerRightWrapper}>
            <IconAnt
              color={"#ffff"}
              size={25}
              name="hearto"
              style={{ marginRight: 10 }}
            />
            <IconAnt color={"#ffff"} size={25} name="message1" />
          </View>
        </View>
        <ScrollView style={styles.feedContainer}>
          <Feed username={"da"} />
          <Feed username={"duongngu"} />
        </ScrollView>
        <Footer/>
      </View>
    </>
  );
}

export default Home;

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "black",
    padding: "0 20",
  },
  header: {
    display: "flex",
    height: 52,
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: "#sss0",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    bottom: 0,
    justifyContent: "space-between",
    padding: 10,
    borderTopColor: "#E8E8E8",
    borderTopWidth: 1,
    backgroundColor: "#sss0",
  },
  feedContainer: {
    display: "flex",
  },
  icon: {
    width: 40,
    height: 40,
  },
  logo: {
    width: 130,
    height: "100%",
  },
  headerRightWrapper: {
    display: "flex",
    flexDirection: "row",
  },
});
