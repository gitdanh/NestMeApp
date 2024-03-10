import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import usePrivateHttpClient from "../../axios/private-http-hook";

const ProfilePosts = ({ username }) => {
  const { privateRequest } = usePrivateHttpClient();
  const [selected, setSelected] = useState(1);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePost, setHasMorePost] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);

  const getPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      const response = await privateRequest(
        `/posts/user/${username}?page=${page}&limit=15`
      );
      const data = response.data;

      if (data) {
        const postsCount = data.posts.length;
        setHasMorePost(postsCount > 0 && postsCount === 10);
        setData((prev) => [...prev, ...data.posts]);
      }
      setPostsLoading(false);
    } catch (err) {
      setPostsLoading(false);
      console.error("profile posts ", err);
    }
  }, [username, page]);

  useEffect(() => {
    getPosts();
  }, [username, page]);

  const renderItems = (item) => {
    return (
      <View style={{ width: "33%", aspectRatio: 1 }}>
        <Image
          source={{ uri: item.item.media[0] }}
          style={{ flex: 1, marginBottom: 3 }}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginTop: 20, paddingBottom: 45 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                width: "50%",
                paddingBottom: 15,
                borderBottomWidth: selected === 1 ? 1 : 0,
                borderBlockColor: "white",
              }}
            >
              <TouchableOpacity
                onPress={() => setSelected(1)}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <IconMaterial color={"gray"} size={25} name="grid-on" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "50%",
                paddingBottom: 15,
                borderBottomWidth: selected === 0 ? 1 : 0,
                borderBlockColor: "white",
              }}
            >
              <TouchableOpacity
                onPress={() => setSelected(0)}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <IconFeather color={"gray"} size={25} name="bookmark" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <FlatList
          data={data}
          renderItem={renderItems}
          keyExtractor={(item) => item._id.toString()}
          numColumns={3}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "space-between",
            flexGrow: 1,
          }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      </View>
    </SafeAreaView>
  );
};
export default ProfilePosts;
