import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Feed from "../components/Feed";
import Footer from "../components/Footer";
import Icon from "react-native-vector-icons/FontAwesome";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconFeather from "react-native-vector-icons/Feather";
import { StatusBar } from "expo-status-bar";
import usePrivateHttpClient from "../axios/private-http-hook";
import { useSelector, useDispatch } from "react-redux";
import { setSocket } from "../store/redux/slices/chatSlice";
import { io } from "socket.io-client";
import { current } from "@reduxjs/toolkit";

function Home(props) {
  const { privateRequest } = usePrivateHttpClient();
  const userId = useSelector((state) => state.authenticate.userId);
  const dispatch = useDispatch();

  const socket = useRef();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePost, setHasMorePost] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);

  useEffect(() => {
    if (userId) {
      if (socket.current == null) {
        socket.current = io(process.env.REACT_APP_SERVER_BASE_URL);
        socket.current.on("connect", () => {
          // yêu cầu kết nối vào 1 socket mới
          console.log(`You connected with socket`, Date().split("G")[0]);
        }); // sự kiện mở kết nối socket
        socket.current.emit("add-user", userId);
        dispatch(setSocket(socket));
      }
    }
  }, [userId]);

  const handleEndReached = () => {
    if (!postsLoading && hasMorePost) {
      console.log("Last post reached");
      setPage((prev) => prev + 1);
      setIsEndReached(true);
    }
  };

  const lastPostRef = useCallback(
    (index) => {
      if (index === posts.length - 1 && !isEndReached) {
        return {
          onLayout: () => setIsEndReached(false),
          ref: lastPostRef,
        };
      }
      return null;
    },
    [isEndReached, posts.length]
  );

  const getPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      const response = await privateRequest(`/posts?page=${page}?limit=10`);
      const data = response.data;

      if (data) {
        const postsCount = data.posts.length;
        setHasMorePost(postsCount > 0 && postsCount === 10);
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setPostsLoading(false);
    } catch (err) {
      setPostsLoading(false);
      console.error("home posts ", err);
    }
  }, [page]);

  useEffect(() => {
    getPosts();
  }, [page]);

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
              onPress={() => props.navigation.navigate("Notify")}
            />
            <IconAnt
              color={"#ffff"}
              size={25}
              name="message1"
              onPress={() => props.navigation.navigate("Chat")}
            />
          </View>
        </View>
        {posts.length > 0 && (
          <FlatList
            style={styles.feedContainer}
            data={posts}
            renderItem={(itemData) => {
              return (
                <Feed
                  post={itemData.item}
                  setPosts={setPosts}
                  {...lastPostRef(itemData.index)}
                />
              );
            }}
            keyExtractor={(item, index) => {
              return item._id;
            }}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
          />
        )}
        {postsLoading && page > 1 && <ActivityIndicator />}
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
    // paddingVertical: 20,
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
