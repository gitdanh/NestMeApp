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
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import IconAnt from "react-native-vector-icons/AntDesign";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import { getAvatarSource } from "../utils/getImageSource";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { favHeart, globalBlue } from "../utils/globalColors";
import Comments from "./Comment/Comments";
import { reactPost } from "../services/postServices";
import usePrivateHttpClient from "../axios/private-http-hook";

const Feed = forwardRef(({ post }, ref) => {
  const { privateRequest } = usePrivateHttpClient();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const authUsername = useSelector((state) => state.authenticate.username);
  const [profile, setProfile] = useState(
    authUsername === post.creator.username ? "Profile" : "OtherProfile"
  );
  const navigator = useNavigation();

  const { width } = useWindowDimensions();

  const [isLiked, setIsLiked] = useState(post.is_user_liked);
  const [reactsCount, setReactsCount] = useState(post.reacts_count);

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
      // if (response) {
      //   socket.current.emit("sendNotification", {
      //     sender_id: user?._id,
      //     receiver_id: props.userId,
      //     content_id: props.postId,
      //     type: "like",
      //   });
      // }
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

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerLeftWrapper}>
          <Pressable onPress={onPressCreatorHandler}>
            <Image
              style={styles.profileThumb}
              source={getAvatarSource(post.creator.profile_picture)}
            />
          </Pressable>
          <Text style={styles.headerTitle} onPress={onPressCreatorHandler}>
            {" "}
            {post.creator.username}
          </Text>
        </View>
        <IconEntypo color={"#ffff"} size={20} name="dots-three-vertical" />
      </View>
      {post.media.length > 1 ? (
        <FlatList
          data={post.media}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: 10 }}>
              <Pressable onPress={handleDoublePress}>
                <Image
                  style={{ height: width - 20, width: width - 20 }}
                  source={{ uri: item }}
                />
              </Pressable>
            </View>
          )}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewabilityConfig.current}
        />
      ) : (
        <View style={{ marginHorizontal: 10 }}>
          <Pressable onPress={handleDoublePress}>
            <Image
              style={{ height: width - 20, width: width - 20 }}
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
        <Icon color={"#ffff"} size={25} name="bookmark-o" />
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
        </View>
      ) : (
        <View
          style={[styles.likesAndCommentsWrapper, { flexDirection: "column" }]}
        >
          <Text style={styles.likesTitle}> {reactsCount} likes</Text>
          <Text>
            <Text style={styles.headerTitle}> {post.creator.username}</Text>{" "}
            <Text style={{ color: "white", fontSize: 14, fontWeight: "400" }}>
              {post.content}
            </Text>
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
              <Text style={{ fontSize: 20, color: "white", fontWeight: "700" }}>
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
});

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
