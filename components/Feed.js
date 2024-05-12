import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  useWindowDimensions,
  Modal,
  Alert,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterialCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import { getAvatarSource } from "../utils/getImageSource";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { favHeart, globalBlue } from "../utils/globalColors";
import Comments from "./Comment/Comments";
import {
  deletePost,
  reactPost,
  reportPost,
  savePost,
} from "../services/postServices";
import usePrivateHttpClient from "../axios/private-http-hook";
import { getGroupCoverUrl } from "../utils/getGroupCoverUrl";

const Feed = forwardRef(
  ({ post, setPosts, groupView = false, callbackFunc = () => {} }, ref) => {
    const { privateRequest } = usePrivateHttpClient();
    const socket = useSelector((state) => state.chat.socket);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const authUsername = useSelector((state) => state.authenticate.username);
    const authUserId = useSelector((state) => state.authenticate.userId);

    const [profile, setProfile] = useState(
      authUsername === post.creator.username ? "Profile" : "OtherProfile"
    );
    const navigator = useNavigation();

    const { width } = useWindowDimensions();

    const [isLiked, setIsLiked] = useState(post.is_user_liked);
    const [reactsCount, setReactsCount] = useState(post.reacts_count);
    const [isSaved, setIsSaved] = useState(post.is_saved);
    const [saving, setSaving] = useState(false);

    const [reportLoading, setReportLoading] = useState(false);

    //double tap
    const [lastPressTime, setLastPressTime] = useState(0);

    const handleDoublePress = async () => {
      const currentTime = new Date().getTime();
      const doublePressDelay = 300; // milliseconds

      if (currentTime - lastPressTime < doublePressDelay) {
        await handleReactPost();
      }

      setLastPressTime(currentTime);
    };

    const handleReactPost = async () => {
      try {
        setIsLiked(!isLiked);
        if (!isLiked) setReactsCount((prev) => ++prev);
        else setReactsCount((prev) => --prev);

        const response = await reactPost(
          { postId: post._id, emoji: "LOVE" },
          privateRequest
        );
        if (response) {
          socket.current.emit("sendNotification", {
            sender_id: authUserId,
            receiver_id: post.creator._id,
            content_id: post._id,
            type: "like",
          });
        }
      } catch (err) {
        console.log("react post err: ", err);
      }
    };

    useEffect(() => {
      setProfile(
        authUsername === post.creator.username ? "Profile" : "OtherProfile"
      );
    }, [post.creator.username]);

    const onPressCreatorHandler = () => {
      navigator.setOptions({
        unmountOnBlur: false,
      });
      navigator.navigate(profile, {
        isOwnProfile: profile === "Profile" ? true : false,
        username: post.creator.username,
      });
    };

    const [currentImageView, setCurrentImageView] = useState(0);

    const onViewableItemsChanged = useRef((item) => {
      const index = item.viewableItems[0].index;
      setCurrentImageView(index);
    });

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

    //Delete post
    const deleteThisPost = async () => {
      if (!reportLoading) {
        try {
          setReportLoading(true);
          const response = await deletePost(post._id, privateRequest);
          if (response.message) {
            setPosts((prevPosts) =>
              prevPosts.filter((prevPost) => prevPost._id !== post._id)
            );
            callbackFunc();
            setReportLoading(false);
            Alert.alert("Success", "Delete post success!");
          }
        } catch (err) {
          setReportLoading(false);
          Alert.alert("Error", "Delete post fail: " + err);
        }
      }
    };

    const handleDeletePost = () => {
      Alert.alert("Are you sure?", "Action cannot be undone!", [
        { text: "Cancle" },
        { text: "Yes", onPress: deleteThisPost, style: "destructive" },
      ]);
    };

    //Report post
    const handleReportPost = async (reportReason) => {
      try {
        setReportLoading(true);
        const response = await reportPost(
          post._id,
          reportReason,
          privateRequest
        );
        if (response.message) {
          setReportLoading(false);

          Alert.alert(
            "Success",
            "Report post success with reason: " + reportReason
          );
        }
      } catch (err) {
        setReportLoading(false);
        Alert.alert("Error", "Report post fail with reason: " + reportReason);
        console.error(err);
      }
    };

    const reasonList = [
      "Indecent photo",
      "Violence",
      "Harassment",
      "Terrorism",
      "Hateful language, false information",
      "Spam",
    ];

    const openReportReasons = () => {
      Alert.alert("Reasons", "Why are you reporting this post?", [
        ...reasonList.map((reason) => ({
          text: reason,
          onPress: () => handleReportPost(reason),
        })),
        { text: "Cancle", style: "cancel" },
      ]);
    };

    //Save post
    const saveThisPost = async () => {
      if (!saving) {
        let message;
        try {
          setSaving(true);
          const response = await savePost(post._id, !isSaved, privateRequest);
          if (response.message) {
            setIsSaved(!isSaved);
            setSaving(false);
            if (!isSaved) message = "Saved post success!";
            else message = "UnSaved post success!";
            Alert.alert("Success", message);
          }
        } catch (err) {
          setSaving(false);
          if (!isSaved) message = "Saved post fail!";
          else message = "UnSaved post fail!";
          Alert.alert("Error", message);
        }
      }
    };

    const togglePostOptions = () => {
      Alert.alert("Action", "What action do you want to take with this post?", [
        {
          text: post.creator._id !== authUserId ? "Report" : "Delete",
          onPress:
            post.creator._id !== authUserId
              ? openReportReasons
              : handleDeletePost,
          style: "destructive",
        },
        { text: "Save post", onPress: saveThisPost },
        { text: "Cancle", style: "cancel" },
      ]);
    };

    return (
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <View style={styles.headerLeftWrapper}>
            {post?.group && !groupView ? (
              <>
                <View style={{ position: "relative" }}>
                  <Pressable
                    onPress={() =>
                      navigator.navigate("GroupDetail", {
                        groupId: post?.group._id,
                      })
                    }
                  >
                    <Image
                      style={{ width: 40, height: 40, borderRadius: 10 }}
                      source={getGroupCoverUrl(post?.group.cover)}
                    />
                  </Pressable>
                  <Pressable onPress={onPressCreatorHandler}>
                    <Image
                      style={{
                        position: "absolute",
                        bottom: -2,
                        left: "45%",
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: "black",
                        width: 24,
                        height: 24,
                      }}
                      source={getAvatarSource(post.creator.profile_picture)}
                    />
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ fontWeight: 600, fontSize: 16, color: "white" }}
                    onPress={() =>
                      navigator.navigate("GroupDetail", {
                        groupId: post?.group._id,
                      })
                    }
                  >
                    {" "}
                    {post?.group.name}
                  </Text>
                  <Text
                    style={{ fontWeight: 400, fontSize: 12, color: "#A8A8A8" }}
                    onPress={onPressCreatorHandler}
                  >
                    {" "}
                    {post.creator.username}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Pressable onPress={onPressCreatorHandler}>
                  <Image
                    style={styles.profileThumb}
                    source={getAvatarSource(post.creator.profile_picture)}
                  />
                </Pressable>
                <Text
                  style={styles.headerTitle}
                  onPress={onPressCreatorHandler}
                >
                  {" "}
                  {post.creator.username}
                </Text>
              </>
            )}
          </View>
          <IconEntypo
            style={{ alignSelf: "center" }}
            color={"#ffff"}
            size={20}
            name="dots-three-horizontal"
            onPress={togglePostOptions}
          />
        </View>
        {post.media.length > 1 ? (
          <FlatList
            data={post.media}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, i) => i.toString()}
            renderItem={({ item }) => (
              <View>
                <Pressable onPress={handleDoublePress}>
                  <Image
                    style={{ height: width + 20, width: width }}
                    source={{ uri: item }}
                  />
                </Pressable>
              </View>
            )}
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={viewabilityConfig.current}
          />
        ) : (
          <View>
            <Pressable onPress={handleDoublePress}>
              <Image
                style={{ height: width + 20, width: width }}
                source={{ uri: post.media[0] }}
              />
            </Pressable>
          </View>
        )}

        <View style={styles.feedImageFooter}>
          <View style={styles.feddimageFooterLeftWrapper}>
            <IconAnt
              color={isLiked ? favHeart : "#ffffff"}
              size={25}
              name={isLiked ? "heart" : "hearto"}
              style={{ marginRight: 15 }}
              onPress={handleReactPost}
            />
            <Icon
              onPress={() => setIsModalVisible(true)}
              color={"#ffff"}
              size={25}
              name="comment-o"
              style={{ marginRight: 15 }}
            />
            <IconFeather color={"#ffff"} size={25} name="send" />
          </View>
          <IconMaterialCommunity
            style={{ marginRight: -6.5 }}
            color={"#ffff"}
            size={30}
            name={isSaved ? "bookmark-check" : "bookmark-outline"}
            onPress={saveThisPost}
          />
          {post.media.length > 1 && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                position: "absolute",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                zIndex: -1,
              }}
            >
              {post.media.map((item, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor:
                        currentImageView === i ? globalBlue : "gray",
                      marginHorizontal: 3,
                    }}
                  />
                );
              })}
            </View>
          )}
        </View>
        {ref ? (
          <View ref={ref} style={styles.likesAndCommentsWrapper}>
            <Text style={styles.likesTitle}> {reactsCount} likes</Text>
            <Text>
              <Text style={styles.headerTitle}> {post.creator.username}</Text>{" "}
              <Text style={{ color: "white", fontSize: 14, fontWeight: "400" }}>
                {post.content}
              </Text>
            </Text>
            <Text
              style={{ color: "#A8A8A8", marginBottom: 6 }}
              onPress={() => setIsModalVisible(true)}
            >
              {" "}
              See {post.comments_count} Comments
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.likesAndCommentsWrapper,
              { flexDirection: "column" },
            ]}
          >
            <Text style={styles.likesTitle}> {reactsCount} likes</Text>
            <Text>
              <Text style={styles.headerTitle}> {post.creator.username}</Text>{" "}
              <Text style={{ color: "white", fontSize: 14, fontWeight: "400" }}>
                {post.content}
              </Text>
            </Text>
            <Text
              style={{ color: "#A8A8A8", marginBottom: 6 }}
              onPress={() => setIsModalVisible(true)}
            >
              {" "}
              See {post.comments_count} Comments
            </Text>
          </View>
        )}

        <Modal
          style={{ marginBottom: 20 }}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              borderTopColor: "#262626",
              borderTopWidth: 5,
            }}
          >
            <View
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#262626",
                paddingTop: 10,
                paddingBottom: 15,
              }}
            >
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* <IconAnt
                color={"white"}
                size={27}
                name="close"
                onPress={() => setIsModalVisible(false)}
              /> */}
                <Text
                  style={{ fontSize: 20, color: "white", fontWeight: "700" }}
                >
                  Comments
                </Text>
                {/* <IconFeather color="#0095f6" size={25} name="send" /> */}
              </View>
            </View>

            <Comments post={post} />
          </View>
        </Modal>
      </View>
    );
  }
);

export default Feed;

export const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  profileThumb: {
    width: 35,
    height: 35,
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
    fontWeight: "500",
  },
  feedImage: {
    height: 370,
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
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
});
