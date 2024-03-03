import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";

const Feed = ({ username }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerLeftWrapper}>
          <Image
            style={styles.profileThumb}
            source={require("../assets/favicon.png")}
          />
          <Text style={styles.headerTitle}> {username}</Text>
        </View>
        <IconEntypo color={"#ffff"} size={20} name="dots-three-vertical" />
      </View>
      <View>
        <Image
          style={styles.feedImage}
          source={require("../assets/logo.jpg")}
        />
      </View>
      <View style={styles.feedImageFooter}>
        <View style={styles.feddimageFooterLeftWrapper}>
          <IconAnt
            color={"#ffff"}
            size={25}
            name="hearto"
            style={{ marginRight: 10 }}
          />
          <Icon
            color={"#ffff"}
            size={25}
            name="comment-o"
            style={{ marginRight: 10 }}
          />
          <IconFeather color={"#ffff"} size={25} name="send" />
        </View>
        <Icon color={"#ffff"} size={25} name="bookmark-o" />
      </View>
      <View style={styles.likesAndCommentsWrapper}>
        <Text style={styles.likesTitle}> 1,124 Likes</Text>
        <Text>
          {" "}
          {/* <Text style={styles.headerTitle}> Catherine</Text>{' '}
          <Text style={styles.likesTitle}> Missing Summary </Text> */}
        </Text>
      </View>
    </View>
  );
};

export default Feed;

export const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  profileThumb: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  headerWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  icon: {
    width: 40,
    height: 40,
    opacity: 0.5,
  },
  headerLeftWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#ffff",
    fontSize: 16,
    fontWeight: "600",
  },
  feedImage: {
    width: "100%",
  },
  feedImageFooter: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feddimageFooterLeftWrapper: {
    flexDirection: "row",
  },
  underLine: {
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  underLineWRapper: {
    backgroundColorolor: "gray",
  },
  likesImage: {
    width: 25,
    height: 25,
  },
  likesAndCommentsWrapper: {
    flexDirection: "row",
    marginLeft: 7,
  },
  likesTitle: {
    color: "gray",
    fontSize: 17,
    fontWeight: "600",
  },
});
