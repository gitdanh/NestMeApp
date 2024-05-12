import React, { useState, useEffect, useCallback, forwardRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import IconAnt from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import defaultCover from "../assets/default-cover.jpg";
import { get1Group } from "../services/groupService";
import usePrivateHttpClient from "../axios/private-http-hook";
import { getGroupCoverUrl } from "../utils/getGroupCoverUrl";
import PendingFeed from "../components/PendingFeed";
import Feed from "../components/Feed"
import {
  createGroupPost,
  getGroupDetail,
  getGroupPosts,
  getJoinRequests,
  getMembers,
  getUserFriendsList,
  editGroup,
  acceptRequestToGroup,
  rejectRequestToGroup,
  inviteUserToGroup
} from "../services/groupService";

const ModalItem = forwardRef(
  (
    {
      item,
      setGroupDetail,
      setUserData,
      listType,
      groupOwner,
    },
    ref
  ) => {
    const { privateRequest } = usePrivateHttpClient();

    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
      try {
        setDecisionLoading(true);
        const response = await acceptRequestToGroup(
          id,
          user._id,
          privateRequest
        );
  
        if (response.message) {
          setUserData((prev) => prev.filter((user) => user._id !== item._id));
          setGroupDetail((prev) => ({
            ...prev,
            requests_count: prev.requests_count - 1,
            members_count: prev.members_count + 1,
          }));
  
          setDecisionLoading(false);
  
          socket.current.emit("sendNotification", {
            sender_id: groupOwner._id,
            receiver_id: [user._id],
            group_id: id,
            reponse: true,
            type: "acceptMember",
          });
        }
      } catch (err) {
        console.error("accept ", err);
        setDecisionLoading(false);
      }
      //  finally {
      //   socket.current.emit("sendNotification", {
      //     sender_id: user?._id,
      //     receiver_id: [props.item._id],
      //     reponse: true,
      //     type: "accept",
      //   });
      // }
    };
    const handleReject = async () => {
      try {
        setDecisionLoading(true);
        const response = await rejectRequestToGroup(
          id,
          user._id,
          privateHttpClient.privateRequest
        );
  
        if (response.message) {
          setUser((prev) => prev.filter((item) => item._id !== user._id));
  
          
          setGroupDetail((prev) => ({
            ...prev,
            requests_count: prev.requests_count - 1,
          }));
  
          setDecisionLoading(false);
          socket.current.emit("sendNotification", {
            sender_id: groupOwner._id,
            receiver_id: [user._id],
            group_id: id,
            reponse: true,
            type: "rejectMember",
          });
        }
      } catch (err) {
        console.error("reject ", err);
        setDecisionLoading(false);
      }
    };
  
    const handleKick = async () => {
      try {
        setDecisionLoading(true);
        const response = await rejectRequestToGroup(
          id,
          user._id,
          privateHttpClient.privateRequest
        );
  
        if (response.message) {
          setUser((prev) => prev.filter((item) => item._id !== user._id));
  
          setGroupDetail((prev) => ({
            ...prev,
            members_count: prev.members_count - 1,
          }));
  
          setDecisionLoading(false);
        }
      } catch (err) {
        console.error("kick ", err);
        setDecisionLoading(false);
      }
    };
  
    const handleInvite = async () => {
      try {
        setDecisionLoading(true);
        const response = await inviteUserToGroup(
          id,
          user._id,
          privateHttpClient.privateRequest
        );
        console.log(response);
        if (response.message) {
          setUser((prev) =>
            prev.map((item) =>
              item._id === user._id ? { ...item, status: "INVITED" } : item
            )
          );
          setDecisionLoading(false);
          socket.current.emit("sendNotification", {
            sender_id: groupOwner._id,
            receiver_id: [user._id],
            group_id: id,
            type: "inviteGroup",
          });
        }
      } catch (err) {
        console.error("invite ", err);
        setDecisionLoading(false);
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
              {listType === 0 ? (user._id === groupOwner._id ? "GROUP OWNER" : user.status) : item.full_name}
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

function GroupDetail(props) {
  const socket = useSelector((state) => state.chat.socket);
  const navigation = useNavigation();
  const { privateRequest } = usePrivateHttpClient();

  const { groupId } = props.route.params;
  const [data, setData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [selected, setSelected] = useState(1);

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

  // const lastPostRef = useCallback(
  //   (index) => {
  //     if (index === posts.length - 1 && !isEndReached) {
  //       return {
  //         onLayout: () => setIsEndReached(false),
  //         ref: lastPostRef,
  //       };
  //     }
  //     return null;
  //   },
  //   [isEndReached, posts.length]
  // );

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

  const getPosts = useCallback(async () => {
    if (!postsLoading) {
      let status;
      if (selected === 0) status = "PENDING";
      else if (selected === 1) status = "APPROVED";
      try {
        setPostsLoading(true);
        const data = await getGroupPosts(
          groupId,
          status,
          postsPage,
          100,
          privateRequest
        );
        console.log(data);
        if (data) {
          setPosts(data.posts);
          setPostsLoading(false);
        }
      } catch (err) {
        console.error("list ", err);
        setPostsLoading(false);
      }
    }
  }, [groupId, selected]);
  

  useEffect(() => {
    getDetail();
    getPosts();
  }, [groupId]);


  const [listType, setListType] = useState(0);
  const [memberRequests, setMemberRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberRequestsPage, setMemberRequestsPage] = useState(1);
  const [membersPage, setMembersPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const getMembersList = useCallback(async () => {
    if (!modalLoading) {
      try {
        setModalLoading(true);
        const data = await getMembers(
          groupId,
          1,
          200,
          privateRequest
        );
        if (data) {
          setMembers(data.members);
          setModalLoading(false);
        }
      } catch (err) {
        setModalLoading(false);
        console.error("list ", err);
      }
    }
  }, [groupId]);

  const getJoinRequetsList = useCallback(async () => {
    if (!modalLoading) {
      try {
        setModalLoading(true);
        const data = await getJoinRequests(
          groupId,
          1,
          200,
          privateRequest
        );
        if (data) {
          setMemberRequests(data.users);
          // const recordsCount = data.friend_requests.length;

          // setHasMoreFriendRequests(recordsCount > 0 && recordsCount === 20);
          // if (recordsCount > 0 && friends.length === 0)
          //   setFriendRequests(data.friend_requests);
          // if (recordsCount > 0 && friends.length > 0)
          //   setFriendRequests((prev) => [...prev, ...data.friend_requests]);
          setModalLoading(false);
        }
      } catch (err) {
        setModalLoading(false);
        console.error("list ", err);
      }
    }
  }, [groupId]);

  return detailLoading ? (
    <ActivityIndicator size={70} />
  ) : (
    <ScrollView style={styles.container}>
      <View>
        <Image
          source={getGroupCoverUrl(data.cover)}
          style={{ borderRadius: 20, width: "100%", height: 240 }}
        />
        <View style={{position: "absolute", width: 40, height: 40, borderRadius: 50, backgroundColor: "rgba(150, 150, 150, 0.411)", left: "5%", top: 10, alignItems: "center", justifyContent: "center"}}>
          <IconAnt
            style={{marginRight: 5}}
            onPress={() => {
              navigation.navigate("Group");
            }}
                color={"white"}
                size={27}
                name="left"
                
              />
        </View>
      </View>
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
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => {
              getMembersList();
              setListType(1);
              setModal(true);
            }}
          >
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
          </TouchableOpacity>
          {data.is_group_admin && 
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                getJoinRequetsList();
                setListType(0);
                setModal(true);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {data.requests_count} Requests
              </Text>
            </TouchableOpacity>
          }
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
                  // {...lastPostRef(itemData.index)}
                />
              );
            }}
            keyExtractor={(item, index) => {
              return item._id;
            }}
            scrollEnabled={false}
            // onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
          />
        )}
        <Modal
        visible={modal}
        onRequestClose={() => {
          setModal(false);
          setMembers([]);
          setMemberRequests([]);
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
                  setMembers([]);
                  setMemberRequests([]);
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
                {listType === 1 ? "Members" : "Member requests"}
              </Text>
            </View>
          </View>
          {listType === 1 && members.length > 0 ? (
            <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
              <View>
                {/* <FlatList
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
                /> */}
              </View>
            </View>
          ) : listType === 2 && memberRequests.length > 0 ? (
            <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
              <View>
                {/* <FlatList
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
                /> */}
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
                No {listType === 1 ? "members" : "member requests"}
              </Text>
            </View>
          )}
          {modalLoading && (
            <>
              {membersPage === 1 && memberRequestsPage === 1 ? (
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
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  feedContainer: {
    display: "flex",
    marginBottom: 50
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: StatusBar.currentHeight || 0,
  },
});
export default GroupDetail;
