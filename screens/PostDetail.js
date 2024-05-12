import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  LogBox,
} from "react-native";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feed from "../components/Feed";

function PostDetail({ navigation, route }) {
  const { post, setPosts, setUserData } = route.params;

  const callbackFunc = () => {
    setUserData((prev) => ({
      ...prev,
      posts_count: prev.posts_count - 1,
    }));
    navigation.goBack();
  };

  useEffect(() => {
    LogBox.ignoreLogs([
      "Non-serializable values were found in the navigation state",
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <IconMaterialCommunityIcons
              color={"white"}
              size={30}
              name="keyboard-backspace"
              style={{ marginRight: 10 }}
              onPress={() => navigation.goBack()}
            />
            <Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
              {" "}
              {post.creator.username}
            </Text>
          </View>
        </View>
      </View>
      <Feed post={post} setPosts={setPosts} callbackFunc={callbackFunc} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: StatusBar.currentHeight || 0,
  },
  listItem: {
    paddingVertical: 8,
    marginVertical: 0,
    backgroundColor: "#000",
  },
  name: {
    fontSize: 14,
    color: "#fff",
  },
  subtitle: {
    fontSize: 12,
    color: "#A8A8A8",
  },
  button: {
    position: "absolute",
    bottom: 15,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});

export default PostDetail;
