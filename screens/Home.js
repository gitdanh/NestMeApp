import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Feed from "../components/Feed";
import GroupFeed from "../components/GroupFeed";
import IconAnt from "react-native-vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import usePrivateHttpClient from "../axios/private-http-hook";
import { useSelector, useDispatch } from "react-redux";
import { setSocket } from "../store/redux/slices/chatSlice";
import { io } from "socket.io-client";
import * as conversationService from "../services/conversationService";
import * as notificationsService from "../services/notificationService";
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

  const [conversationUnread, setConversationUnread] = useState([]);
  const [unreadMsg, setUnreadMsg] = useState(0);
  const [unreadNotification, setUnreadNotification] = useState(0);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (notification) {
          // console.log(user?._id);
          if (userId) {
            const data = await notificationsService.getNotifications(userId, 0);
            const unreadCount = data.filter(
              (notification) => !notification.read
            );
            setUnreadNotification(unreadCount.length);
            setNotification(data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      let unread;
      const fetchData = async () => {
        try {
          const data = await conversationService.getUserConversations(userId);
          unread = data.filter((item) => item.unread === true);
          setConversationUnread(unread);
          setUnreadMsg(unread.length);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    const handleGetMsgNotification = async (data) => {
      console.log("Nhận được message:", data);
      console.log(conversationUnread);
      if (checkCurrentChatIdRef.current === data.conversationId) {
        dispatch({
          type: "ADD_MESSAGE",
          payload: data,
        });
      }
      console.log(
        conversationUnread.find((con) => con._id === data.conversationId)
      );
      if (!conversationUnread.find((con) => con._id === data.conversationId)) {
        console.log("toi day chua");
        setConversationUnread((prevCon) => [
          ...prevCon,
          { _id: data.conversationId },
        ]);
        setUnreadMsg((prevCount) => prevCount + 1);
      }
    };

    socket.current?.on("msg-recieve", handleGetMsgNotification);

    return () => {
      // Hủy đăng ký sự kiện khi component unmount
      socket.current?.off("msg-recieve", handleGetMsgNotification);
    };
  }, [socket.current, conversationUnread]);

  useEffect(() => {
    const handleGetNotification = async (data) => {
      console.log("Nhận được thông báo:", data);
      if (data.remove == true) {
        setNotification((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== data.content_id
          )
        );
      } else {
        setNotification((prevNotifications) => [data, ...prevNotifications]);
      }
      const check = notification.find(
        (notification) => notification._id === data.content_id
      );
      console.log(check);
      console.log(check?.read);
      if (!check?.read) {
        if (!data.remove) setUnreadNotification((prevCount) => prevCount + 1);
        else setUnreadNotification((prevCount) => prevCount - 1);
      }
    };

    socket.current?.on("getNotification", handleGetNotification);

    return () => {
      // Hủy đăng ký sự kiện khi component unmount
      socket.current?.off("getNotification", handleGetNotification);
    };
  }, [socket.current]);

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
        const postsCount = data?.posts.length;
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
              onPress={async () => {
                await notificationsService.addReader();
                props.navigation.navigate("Notify");
              }}
            />
            {unreadNotification > 0 ? (
              <View
                style={{
                  position: "absolute",
                  width: 13,
                  height: 12,
                  borderRadius: 50,
                  backgroundColor: "rgb(255, 8, 8)",
                  left: "25%",
                  top: 0,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 9,
                    marginLeft: 4,
                    marginBottom: 2,
                  }}
                >
                  {unreadNotification}
                </Text>
              </View>
            ) : null}
            <IconAnt
              color={"#ffff"}
              size={25}
              name="message1"
              onPress={() => props.navigation.navigate("Chat")}
            />
            {unreadMsg > 0 ? (
              <View
                style={{
                  position: "absolute",
                  width: 13,
                  height: 12,
                  borderRadius: 50,
                  backgroundColor: "rgb(255, 8, 8)",
                  left: "82%",
                  top: 0,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 9,
                    marginLeft: 4,
                    marginBottom: 2,
                  }}
                >
                  {unreadMsg}
                </Text>
              </View>
            ) : null}
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
