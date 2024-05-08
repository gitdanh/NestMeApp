import React, { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, ScrollView, Image, Alert } from "react-native";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileDetails from "../components/Profile/ProfileDetails";
import ProfilePosts from "../components/Profile/ProfilePosts";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import usePrivateHttpClient from "../axios/private-http-hook";

function Profile(props) {
  const { isOwnProfile, username } = props.route.params;
  const authUsername = useSelector((state) => state.authenticate.username);

  const { privateRequest } = usePrivateHttpClient();

  const [usernameView, setUsernameView] = useState(
    isOwnProfile ? authUsername : username
  );
  const [userData, setUserData] = useState(null);

  const getProfileInfo = useCallback(async () => {
    try {
      const response = await privateRequest(`/users/${usernameView}`);
      if (response) {
        setUserData(response.data.user);
      }
    } catch (err) {
      Alert.alert("Error get profile info", err.message);
    }
  }, [usernameView]);

  useEffect(() => {
    getProfileInfo();
  }, [usernameView]);

  useEffect(() => {
    setUsernameView(isOwnProfile ? authUsername : username);
  }, [isOwnProfile, username]);

  return (
    <>
      <StatusBar style="light" />
      {userData && (
        <View style={styles.container}>
          <ProfileHeader username={userData?.username} />
          <ProfileDetails
            userId={userData?._id}
            username={userData?.username}
            fullname={userData?.full_name}
            avatar={userData?.profile_picture}
            userInfo={userData?.user_info}
            isFriend={userData?.is_friend}
            postsCount={userData?.posts_count}
            friendsCount={userData?.friends_count}
            friendRequestsCount={userData?.friend_requests_count}
          />
          <ProfilePosts username={userData?.username} />
        </View>
      )}
    </>
  );
}

export default Profile;

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "black",
    // paddingVertical: 20,
  },
});
