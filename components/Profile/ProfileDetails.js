import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAvatarSource } from "../../utils/getImageSource";

const ProfileDetails = ({
  fullname,
  avatar,
  userInfo,
  postsCount,
  friendsCount,
  friendRequestsCount,
}) => {
  const navigation = useNavigation();
  return (
    <View style={{ paddingHorizontal: 15 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 15,
        }}
      >
        <Image
          style={{ height: 80, width: 80, borderRadius: 50 }}
          source={getAvatarSource(avatar)}
        />
        <View style={{ width: 75, alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
            {postsCount} Posts
          </Text>
        </View>
        <View style={{ width: 75, alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
            {friendsCount} Friends
          </Text>
        </View>
        <View style={{ width: 75, alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
            {friendRequestsCount} Requests
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 18, fontWeight: "400", color: "white" }}>
        {fullname}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: "400", color: "white" }}>
        {userInfo?.bio}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-beetwen",
          alignItems: "center",
          marginTop: 15,
          marginHorizontal: 10,
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("Edit")}
        >
          <Text
            style={{
              backgroundColor: "#1D1B1B",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
              textAlign: "center",
              color: "white",
              fontSize: 14,
              fontWeight: "400",
              color: "white",
            }}
          >
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ProfileDetails;
