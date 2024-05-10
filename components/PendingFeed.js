import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from "react-native";
import { getAvatarSource } from "../utils/getImageSource";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const PendingFeed = forwardRef(({ post, setPosts }, ref) => {
    const { width } = useWindowDimensions();
    const authUsername = useSelector((state) => state.authenticate.username);
    const authUserId = useSelector((state) => state.authenticate.userId);

    const [profile, setProfile] = useState(
        authUsername === post.creator.username ? "Profile" : "OtherProfile"
    );
    const onPressCreatorHandler = () => {
        navigator.navigate(profile, {
          isOwnProfile: profile === "Profile" ? true : false,
          username: post.creator.username,
        });
      };
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
              <Pressable>
                <Image
                  style={{ height: width - 20, width: width - 20 }}
                  source={{ uri: item }}
                />
              </Pressable>
            </View>
          )}
        />
      ) : (
        <View style={{ marginHorizontal: 10 }}>
          <Pressable>
            <Image
              style={{ height: width - 20, width: width - 20 }}
              source={{ uri: post.media[0] }}
            />
          </Pressable>
        </View>
      )}

      <View style={styles.feedImageFooter}>
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
          <Text>
            <Text style={styles.headerTitle}> {post.creator.username}</Text>{" "}
            <Text style={{ color: "white", fontSize: 14, fontWeight: "400" }}>
              {post.content}
            </Text>
          </Text>
        </View>
      )}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginVertical: 15, paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={{
              width: "45%",
              backgroundColor: "#0095f6",
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginRight: "10%",
            }}
            // onPress={handleAcceptToGroup}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "45%",
              backgroundColor: "#ff6666",
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            // onPress={handleDeleteToGroup}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
              Reject
            </Text>
          </TouchableOpacity>
        </View>
    </View>
  );
});

export default PendingFeed;
export const styles = StyleSheet.create({
    container: {
      display: "flex",
    },
    profileThumb: {
      width: 35,
      height: 35,
      borderRadius: 10,
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