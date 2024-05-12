import React, { forwardRef, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import usePrivateHttpClient from "../../axios/private-http-hook";
import { useNavigation } from "@react-navigation/native";

const ProfilePost = forwardRef(({ item }, ref) => {
  const navigator = useNavigation();

  return (
    <TouchableOpacity
      style={{ width: "33%" }}
      onPress={() => {
        navigator.navigate("PostDetail", {
          post: item,
        });
      }}
    >
      {ref ? (
        <View ref={ref} style={{ width: "100%", aspectRatio: 1 }}>
          <Image
            source={{ uri: item.media[0] }}
            style={{ flex: 1, marginBottom: 3, marginHorizontal: 1 }}
          />
        </View>
      ) : (
        <View style={{ width: "100%", aspectRatio: 1 }}>
          <Image
            source={{ uri: item.media[0] }}
            style={{ flex: 1, marginBottom: 3, marginHorizontal: 1 }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
});

const ProfilePosts = ({ username, avatar, isOwnProfile }) => {
  const { privateRequest } = usePrivateHttpClient();
  const [selected, setSelected] = useState(0);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePost, setHasMorePost] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);

  const handleEndReached = () => {
    if (!postsLoading && hasMorePost) {
      setPage((prev) => prev + 1);
      setIsEndReached(true);
    }
  };

  const lastPostRef = useCallback(
    (index) => {
      if (index === data.length - 1 && !isEndReached) {
        return {
          onLayout: () => setIsEndReached(false),
          ref: lastPostRef,
        };
      }
      return null;
    },
    [isEndReached, data.length]
  );

  const getPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      const response = await privateRequest(
        selected === 0
          ? `/posts/user/${username}?page=${page}&limit=15`
          : `/posts/user/${username}/saved-posts?page=${page}&limit=15`
      );
      const data = response.data;

      if (data) {
        const postsCount =
          selected === 0 ? data.posts.length : data.saved_posts.length;
        setHasMorePost(postsCount > 0 && postsCount === 15);
        selected === 0
          ? setData((prev) => [...prev, ...data.posts])
          : setData((prev) => [...prev, ...data.saved_posts]);
      }
      setPostsLoading(false);
    } catch (err) {
      setPostsLoading(false);
      console.error("profile posts ", err);
    }
  }, [username, page, selected]);

  useEffect(() => {
    getPosts();
  }, [username, page, selected]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginTop: 20, paddingBottom: 45 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
              justifyContent: "center",
              flexGrow: 2,
            }}
          >
            <View
              style={{
                width: "50%",
                paddingBottom: 15,
                borderBottomWidth: selected === 0 ? 1 : 0,
                borderBlockColor: "white",
                flexGrow: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setSelected(0);
                  setPage(1);
                  setData([]);
                }}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <IconMaterial color={"gray"} size={25} name="grid-on" />
              </TouchableOpacity>
            </View>
            {isOwnProfile && (
              <View
                style={{
                  width: "50%",
                  paddingBottom: 15,
                  borderBottomWidth: selected === 1 ? 1 : 0,
                  borderBlockColor: "white",
                  flexGrow: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setSelected(1);
                    setPage(1);
                    setData([]);
                  }}
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <IconFeather color={"gray"} size={25} name="bookmark" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            return <ProfilePost item={item} {...lastPostRef(index)} />;
          }}
          keyExtractor={(item) => item._id.toString()}
          numColumns={3}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "space-between",
            flexGrow: 1,
          }}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            marginEnd: -5,
            marginStart: -1,
          }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
        />
        {postsLoading && <ActivityIndicator size={"small"} />}
      </View>
    </SafeAreaView>
  );
};
export default ProfilePosts;
