import React from "react";
import {View, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather";
const Footer = ({ }) => {
    return (
        <View style={styles.footer}>
          <Icon color={"#ffff"} size={25} name="home" />
          <Icon color={"gray"} size={25} name="search" />
          <Icon color={"gray"} size={25} name="plus-square" />
          <IconFeather color={"gray"} size={25} name="log-out" />
        </View>
    );
}
export default Footer;
export const styles = StyleSheet.create({
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
});