import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import defaultCover from "../assets/default-cover.jpg";
import { get1Group } from "../services/groupService";
import usePrivateHttpClient from "../axios/private-http-hook";
import { getGroupCoverUrl } from "../utils/getGroupCoverUrl";
import PendingFeed from "../components/PendingFeed";
import {
  createGroupPost,
  getGroupDetail,
  getGroupPosts,
  getJoinRequests,
  getMembers,
  getUserFriendsList,
  editGroup,
} from "../services/groupService";
function GroupDetail(props) {
  const { privateRequest } = usePrivateHttpClient();

  const { groupId } = props.route.params;
  const [data, setData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [selected, setSelected] = useState(0);

  const [postsLoading, setPostsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [postsPage, setPostsPage] = useState(1);
  const [posts, setPosts] = useState([]);

  const [isEndReached, setIsEndReached] = useState(false);

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

  const getDetail = useCallback(async () => {
    try {
      setDetailLoading(true);
      const respone = await get1Group(groupId, privateRequest);
      if (respone) {
        setData(respone.group_detail);
        setDetailLoading(false);
      }
    } catch (err) {
      setDetailLoading(false);
      console.log("group detail: ", err);
    }
  }, [groupId]);

  // const getPosts = useCallback(async () => {
  //   if (!postsLoading) {
  //     let status;
  //     if (selected === 0) status = "PENDING";
  //     else if (selected === 1) status = "APPROVED";
  //     try {
  //       setPostsLoading(true);
  //       const data = await getGroupPosts(
  //         groupId,
  //         status,
  //         postsPage,
  //         100,
  //         privateRequest
  //       );

  //       if (data) {
  //         setPosts(data.posts);
  //         setPostsLoading(false);
  //       }
  //     } catch (err) {
  //       console.error("list ", err);
  //       setPostsLoading(false);
  //     }
  //   }
  // }, [groupId, selected]);
  const getPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      const response = await privateRequest(`/posts?page=${page}?limit=10`);
      const data = response.data;

      if (data) {
        // const postsCount = data?.posts.length;
        // setHasMorePost(postsCount > 0 && postsCount === 10);
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setPostsLoading(false);
    } catch (err) {
      setPostsLoading(false);
      console.error("home posts ", err);
    }
  }, [page]);

  useEffect(() => {
    getDetail();
    getPosts();
  }, [groupId]);

  return detailLoading ? (
    <ActivityIndicator size={70} />
  ) : (
    <ScrollView style={styles.container}>
      <Image
        source={getGroupCoverUrl(data.cover)}
        style={{ borderRadius: 20, width: "100%", height: 240 }}
      />
      <View style={{ padding: 10 }}>
        <Text
          style={{
            color: "white",
            fontSize: 25,
            fontWeight: 600,
            marginBottom: 7,
          }}
        >
          {data.name}
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 7 }}>
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              marginRight: 20,
            }}
          >
            {data.group_posts_count} Posts
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              marginRight: 20,
            }}
          >
            {data.members_count} Members
          </Text>
        </View>
        <Text style={{ color: "#A8A8A8", fontSize: 14, fontWeight: 500 }}>
          {data.description}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          style={{
            width: "40%",
            backgroundColor: "#363636",
            padding: 10,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginRight: "5%",
          }}
        >
          <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
            Create Post
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "40%",
            backgroundColor: "#0095f6",
            padding: 10,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginRight: "5%",
          }}
        >
          <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
            Invite
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Ionicons color={"white"} size={22} name="ellipsis-horizontal" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 5,
        }}
      >
        <View
          style={{
            paddingBottom: 15,
            borderBottomWidth: selected === 1 ? 1 : 0,
            borderBlockColor: "white",
            width: 120,
          }}
        >
          <TouchableOpacity
            onPress={() => setSelected(1)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <IconMaterial
              color={selected === 1 ? "white" : "gray"}
              size={22}
              name="grid-on"
            />
            <Text
              style={{
                color: selected === 1 ? "white" : "gray",
                fontSize: 16,
                fontWeight: 700,
                marginLeft: 5,
              }}
            >
              Posts
            </Text>
          </TouchableOpacity>
        </View>
        {data.is_group_admin && (
          <View
            style={{
              width: 120,
              paddingBottom: 10,
              borderBottomWidth: selected === 0 ? 1 : 0,
              borderBlockColor: "white",
            }}
          >
            <TouchableOpacity
              onPress={() => setSelected(0)}
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Ionicons
                color={selected === 0 ? "white" : "gray"}
                size={25}
                name="ellipsis-horizontal-circle-outline"
              />
              <Text
                style={{
                  color: selected === 0 ? "white" : "gray",
                  fontSize: 16,
                  fontWeight: 700,
                  marginLeft: 5,
                }}
              >
                Pending
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
      </View>
      {posts.length > 0 && (
          <FlatList
            style={styles.feedContainer}
            data={posts}
            renderItem={(itemData) => {
              return (
                <PendingFeed
                  post={itemData.item}
                  setPosts={setPosts}
                  {...lastPostRef(itemData.index)}
                />
              );
            }}
            keyExtractor={(item, index) => {
              return item._id;
            }}
            scrollEnabled={false}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
          />
        )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  feedContainer: {
    display: "flex",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: StatusBar.currentHeight || 0,
  },
});
export default GroupDetail;
