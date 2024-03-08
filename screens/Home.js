import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import Feed from "../components/Feed";
import Icon from "react-native-vector-icons/FontAwesome";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconFeather from "react-native-vector-icons/Feather";
import { StatusBar } from "expo-status-bar";
import usePrivateHttpClient from "../axios/private-http-hook";

function Home(props) {
  //const { loginUser } = props.route.params;
  const { privateRequest } = usePrivateHttpClient();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePost, setHasMorePost] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  const getPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      const response = await privateRequest(`/posts?page=${page}?limit=10`);
      const data = response.data;

      if (data) {
        const postsCount = data.posts.length;
        setHasMorePost(postsCount > 0 && postsCount === 10);

        if (postsCount > 0 && page === 1) setPosts(data.posts);
        else setPosts((prev) => [...prev, ...data.posts]);
      }
      setPostsLoading(false);
    } catch (err) {
      setPostsLoading(false);
      console.error("home posts ", err);
    }
  }, [page]);

  useEffect(() => {
    getPosts();
    setPosts(posts.filter((post) => post?.group === null));
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
            />
            <IconAnt color={"#ffff"} size={25} name="message1" />
          </View>
        </View>
        {posts.length > 0 && (
          <FlatList
            style={styles.feedContainer}
            data={posts}
            renderItem={(itemData) => {
              return <Feed post={itemData.item} />;
            }}
            keyExtractor={(item, index) => {
              return item.postId;
            }}
          />
        )}
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
