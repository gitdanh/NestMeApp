import React, { forwardRef, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAvatarSource } from "../../utils/getImageSource";
import usePrivateHttpClient from "../../axios/private-http-hook";
import {
  acceptAddFriend,
  getFriendRequestsList,
  getUserFriendsListByUsername,
  rejectAddFriend,
  sendAddFriend,
} from "../../services/userService";
import IconAnt from "react-native-vector-icons/AntDesign";
import { useSelector } from "react-redux";

const ModalItem = forwardRef(
  (
    {
      item,
      setRequestSent,
      setRequestDecision,
      setUserData,
      listType,
      myId,
      myProfile,
      isFriend,
      isSent,
    },
    ref
  ) => {
    const { privateRequest } = usePrivateHttpClient();

    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddFriend = async () => {
      try {
        setLoading(true);
        const response = await sendAddFriend(item._id, privateRequest);
        if (response.message) {
          setRequestSent(item._id);
          setLoading(false);
          socket.current.emit("sendNotification", {
            sender_id: userId,
            receiver_id: [item._id],
            type: "request",
          });
        }
      } catch (err) {
        setLoading(false);
        console.error(err.message);
      }
    };

    const handleAccept = async () => {
      try {
        setLoading(true);
        const response = await acceptAddFriend(item._id, privateRequest);

        if (response.message) {
          setRequestDecision(item._id, "ACCEPT");
          setUserData((prev) => ({
            ...prev,
            friends_count: prev.friends_count + 1,
          }));
          setUserData((prev) => ({
            ...prev,
            friend_requests_count: prev.friend_requests_count - 1,
          }));

          setStatus("Accepted!");

          setLoading(false);
          socket.current.emit("sendNotification", {
            sender_id: userId,
            receiver_id: [item._id],
            reponse: true,
            type: "accept",
          });
        }
      } catch (err) {
        console.error("accept ", err);
        setLoading(false);
      }
    };
    const handleReject = async () => {
      try {
        setLoading(true);
        const response = await rejectAddFriend(item._id, privateRequest);
        if (response.message) {
          setRequestDecision(item._id, "REJECT");
          setLoading(false);
          socket.current.emit("sendNotification", {
            sender_id: userId,
            receiver_id: [item._id],
            reponse: false,
            type: "reject",
          });
          setStatus("Rejected!");
        }
      } catch (err) {
        console.error("reject ", err);
        setLoading(false);
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
              {item.username}
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
              {item.full_name}
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
          ) : loading ? (
            <ActivityIndicator />
          ) : listType === 2 ? (
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
                onPress={handleAccept}
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
                onPress={handleReject}
              >
                <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
                  Reject
                </Text>
              </TouchableOpacity>
            </>
          ) : listType === 1 ? (
            <>
              {myProfile || isFriend || myId === item._id ? null : isSent ? (
                <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
                  Sent
                </Text>
              ) : (
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
                  onPress={handleAddFriend}
                >
                  <Text
                    style={{ color: "white", fontSize: 14, fontWeight: 500 }}
                  >
                    Add friend
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : null}
        </View>
      </View>
    );
  }
);

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
  isOwnProfile,
}) => {
  const navigation = useNavigation();
  const { privateRequest } = usePrivateHttpClient();
  const myUserId = useSelector((state) => state.authenticate.userId);

  const [listType, setListType] = useState(0);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [hasMoreFriends, setHasMoreFriends] = useState(true);
  const [hasMoreFriendRequests, setHasMoreFriendRequests] = useState(true);
  const [friendRequestsPage, setFriendRequestsPage] = useState(1);
  const [friendsPage, setFriendsPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

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
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => {
              getFriends();
              setListType(1);
              setModal(true);
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
              {friendsCount}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>
              Friends
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: 75, alignItems: "center" }}>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => {
              getFriendRequests();
              setListType(2);
              setModal(true);
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
              {friendRequestsCount}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>
              Requests
            </Text>
          </TouchableOpacity>
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
        visible={modal}
        onRequestClose={() => {
          setModal(false);
          setFriends([]);
          setFriendRequests([]);
        }}
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
                onPress={() => {
                  setModal(false);
                  setFriends([]);
                  setFriendRequests([]);
                }}
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
                {listType === 1 ? "Friends" : "Friend requests"}
              </Text>
            </View>
          </View>
          {listType === 1 && friends.length > 0 ? (
            <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
              <View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  data={friends}
                  renderItem={({ item, index }) => {
                    return (
                      <ModalItem
                        myId={myUserId}
                        listType={1}
                        myProfile={isOwnProfile}
                        isFriend={item?.is_your_friend ? true : false}
                        isSent={item?.is_friend_request_sent ? true : false}
                        item={item}
                        setRequestSent={setRequestSent}
                      />
                    );
                  }}
                />
              </View>
            </View>
          ) : listType === 2 && friendRequests.length > 0 ? (
            <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
              <View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  data={friendRequests}
                  renderItem={({ item, index }) => {
                    return (
                      <ModalItem
                        listType={2}
                        item={item}
                        setRequestDecision={setRequestDecision}
                        setUserData={setUserData}
                      />
                    );
                  }}
                />
              </View>
            </View>
          ) : modalLoading ? null : (
            <View
              style={{
                borderTopColor: "#262626",
                borderWidth: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: "#A8A8A8",
                  marginTop: 10,
                }}
              >
                No {listType === 1 ? "friends" : "friend requests"}
              </Text>
            </View>
          )}
          {modalLoading && (
            <>
              {friendsPage === 1 && friendRequestsPage === 1 ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator size={"large"} />
                </View>
              ) : (
                <ActivityIndicator />
              )}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};
export default ProfileDetails;
