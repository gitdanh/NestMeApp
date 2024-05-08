import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAvatarSource } from "../../utils/getImageSource";
import usePrivateHttpClient from "../../axios/private-http-hook";
import {
  getFriendRequestsList,
  getUserFriendsListByUsername,
} from "../../services/userService";

const ProfileDetails = ({
  userId,
  username,
  fullname,
  avatar,
  userInfo,
  isFriend,
  postsCount,
  friendsCount,
  friendRequestsCount,
}) => {
  const navigation = useNavigation();
  const { privateRequest } = usePrivateHttpClient();

  const [listType, setListType] = useState(0);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [hasMoreFriends, setHasMoreFriends] = useState(true);
  const [hasMoreFriendRequests, setHasMoreFriendRequests] = useState(true);
  const [friendRequestsPage, setFriendRequestsPage] = useState(1);
  const [friendsPage, setFriendsPage] = useState(1);

  const getFriends = useCallback(async () => {
    console.log("friends load");
    try {
      setModalLoading(true);
      const data = await getUserFriendsListByUsername(
        username,
        friendsPage,
        20,
        privateRequest
      );

      if (data) {
        const recordsCount = data.friends.length;

        setHasMoreFriends(recordsCount > 0 && recordsCount === 20);
        if (recordsCount > 0 && friends.length === 0) setFriends(data.friends);
        if (recordsCount > 0 && friends.length > 0)
          setFriends((prev) => [...prev, ...data.friends]);
      }

      setModalLoading(false);
    } catch (err) {
      setModalLoading(false);
    }
  }, [username, friendsPage]);

  const getFriendRequests = useCallback(async () => {
    console.log("friends request load");
    try {
      setModalLoading(true);
      const data = await getFriendRequestsList(
        friendRequestsPage,
        20,
        privateRequest
      );

      if (data) {
        const recordsCount = data.friend_requests.length;

        setHasMoreFriendRequests(recordsCount > 0 && recordsCount === 20);
        if (recordsCount > 0 && friends.length === 0)
          setFriendRequests(data.friend_requests);
        if (recordsCount > 0 && friends.length > 0)
          setFriendRequests((prev) => [...prev, ...data.friend_requests]);
      }
      setModalLoading(false);
    } catch (err) {
      setModalLoading(false);
      console.error("list ", err);
    }
  }, [friendRequestsPage]);

  const setRequestDecision = useCallback((recordId, decision) => {
    // Update UI optimistically
    setFriendRequests((prev) =>
      prev.map((request) =>
        request._id === recordId ? { ...request, decision: decision } : request
      )
    );
  }, []);

  const setRequestSent = useCallback((recordId) => {
    // Update UI optimistically
    setFriends((prev) =>
      prev.map((friend) =>
        friend._id === recordId
          ? { ...friend, is_friend_request_sent: true }
          : friend
      )
    );
  }, []);

  const renderModalItems = ({ item }) => {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const handleDeleteToGroup = async () => {
      if (!loading) {
        setLoading(true);
        try {
          const respone = await deleteToGroup(
            item._id,
            privateHttpRequest.privateRequest
          );
          if (respone !== null) {
            setStatus("Rejected");
            setLoading(false);
            socket.current.emit("sendNotification", {
              sender_id: user._id,
              receiver_id: [item.owner],
              group_id: item._id,
              reponse: false,
              type: "rejectGroup",
            });
          }
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      }
    };

    const handleAcceptToGroup = async () => {
      if (!loading) {
        setLoading(true);
        console.log(item._id);
        try {
          const respone = await acceptToGroup(
            item._id,
            privateHttpRequest.privateRequest
          );
          if (respone !== null) {
            setStatus("Accepted");
            const newgroup = {
              _id: item._id,
              name: item.name,
              cover: item.cover,
              status: "MEMBER",
            };
            setMemberGroups((prev) => [...prev, newgroup]);
            setLoading(false);
            socket.current.emit("sendNotification", {
              sender_id: user._id,
              receiver_id: [item.owner],
              group_id: item._id,
              reponse: true,
              type: "acceptGroup",
            });
          }
          console.log(respone);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      }
    };
    return (
      <View style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: "row", paddingVertical: 15 }}>
          <Image
            source={getAvatarSource(item.profile_picture)}
            style={{ borderRadius: 50, width: 40, height: 40 }}
          />
          <View style={{ flexDirection: "column", marginLeft: 20 }}>
            <Text style={{ color: "white", fontSize: 15, fontWeight: 700 }}>
              {item.name}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: 400,
                flexWrap: "nowrap",
                maxWidth: "100%",
              }}
              numberOfLines={1}
            >
              {item.fullname}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          {status !== "" ? (
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "#A8A8A8",
                marginLeft: 20,
                marginTop: 10,
              }}
            >
              {status}
            </Text>
          ) : (
            <>
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
                onPress={handleAcceptToGroup}
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
                onPress={handleDeleteToGroup}
              >
                <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
                  Reject
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

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
            {postsCount}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>
            Posts
          </Text>
        </View>
        <View style={{ width: 75, alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
            {friendsCount}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>
            Friends
          </Text>
        </View>
        <View style={{ width: 75, alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
            {friendRequestsCount}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>
            Requests
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
      <Modal
        visible={modalInvited}
        onRequestClose={() => setModalInvited(false)}
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
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <IconAnt
                color={"white"}
                size={27}
                name="close"
                onPress={() => setModalInvited(false)}
              />
              <Text
                style={{
                  flex: 1,
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: "center",
                  marginRight: 30,
                }}
              >
                Group Invited
              </Text>
            </View>
          </View>
          {invitedGroups.length > 0 ? (
            <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
              <View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  data={invitedGroups}
                  renderItem={renderModalItems}
                />
              </View>
            </View>
          ) : (
            <View
              style={{
                borderTopColor: "#262626",
                borderWidth: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  color: "#A8A8A8",
                  marginTop: 10,
                }}
              >
                No {listType === 1 ? "friends" : "friend requests"}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};
export default ProfileDetails;
