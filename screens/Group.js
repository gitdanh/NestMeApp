import defaultCover from "../assets/default-cover.jpg";
import React, { useState, useCallback, useEffect,forwardRef } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  FlatList,
  Text,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import usePrivateHttpClient from "../axios/private-http-hook";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../components/button/PrimaryButton";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconFeather from "react-native-vector-icons/Feather";
import { form } from "../styles/authStyle";
import { UserSkeleton } from "../components/UserSkeleton";
import {
  getAdminGroups,
  getMemberGroups,
  getInvitedGroups,
  createGroup,
  searchGroups,
  acceptToGroup,
  deleteToGroup,
  requestToGroup,

} from "../services/groupService";
import { getGroupCoverUrl } from "../utils/getGroupCoverUrl";
import { SearchGroupItems } from "../components/SearchGroupItems";
import { InvitedGroupItem } from "../components/InvitedGroupItem";
function Group() {
  const navigation = useNavigation();
  const {privateRequest} = usePrivateHttpClient();
  const [modalInvited, setModalInvited] = useState(false);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [searchedGroups, setSearchedGroups] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [adminGroups, setAdminGroups] = useState([]);
  const [memberGroups, setMemberGroups] = useState([]);
  const [invitedGroups, setInvitedGroups] = useState([]);
  const socket = useSelector((state) => state.chat.socket);
  const userId = useSelector((state) => state.authenticate.userId);
  const avatar = useSelector((state) => state.authenticate.avatar);
  const user = {
    _id: userId,
    avatar: avatar,
  };
  const getAdminGroup = useCallback(async () => {
    try {
      setIsLoadingSearch(true);
      const data = await getAdminGroups(privateRequest);
      setAdminGroups(data.groups);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getMemberGroup = useCallback(async () => {
    try {
      const data = await getMemberGroups(privateRequest);
      setMemberGroups(data.groups);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getInvitedGroup = useCallback(async () => {
    try {
      const data = await getInvitedGroups(privateRequest);
      if (data) {
        setInvitedGroups(data.groups);
        setIsLoadingSearch(false);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);
  useEffect(() => {
    getAdminGroup();
    getMemberGroup();
    getInvitedGroup();
  }, []);

  const handleCreateGroup = async () => {
    setCreatingGroup(true);
    try {
      const respone = await createGroup(
        {
          name: name,
          description: bio,
          cover: "",
          status: "ADMIN",
        },
        privateRequest
      );
      if (respone !== null) {
        setAdminGroups((prev) => [...prev, respone]);
        setCreatingGroup(false);
        setModal(false);
      }
    } catch (err) {
      console.error(err);
      setCreatingGroup(false);
      setModal(false);
    }
  };

  const renderItems = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}
        onPress={() =>{
            navigation.navigate("GroupDetail", { groupId: item._id })
          }
        }
      >
        <Image
          source={getGroupCoverUrl(item.cover)}
          style={{ borderRadius: 10, width: 40, height: 40 }}
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
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const searchGroup = async (data) => {
    if (data.trim() === "") {
      setIsSearching(false);
    } else {
      setIsSearching(true);
      setIsLoadingSearch(true);
    }
    try {
      const result = await searchGroups(
        data,
        privateRequest
      );
      console.log(result);
      if (result !== null) {
        setSearchedGroups(result);
      }
      setIsLoadingSearch(false);
    } catch (err) {
      setIsLoadingSearch(false);
      console.log(err);
    }
  };
  const debounce = (fn, delay) => {
    let timerId = null;

    return function (...args) {
      clearTimeout(timerId);

      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };
  const debouncedSearchGroups = debounce(searchGroup, 500);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: "500",
            color: "white",
            textAlign: "center",
            marginLeft: 60,
          }}
        >
          Groups
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconFeather
            color={"white"}
            size={23}
            name="user-plus"
            style={{ marginRight: 10, marginBottom: 2 }}
            onPress={() => setModalInvited(true)}
          />

          <Icon
            color={"white"}
            size={25}
            name="add-circle-outline"
            style={{ marginRight: 10 }}
            onPress={() => setModal(true)}
          />
        </View>
      </View>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 5,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            elevation: 5,
            alignItems: "center",
            flexDirection: "row",
            paddingVertical: 7,
            marginBottom: 10,
            backgroundColor: "rgb(38, 38, 38)",
            width: "90%",
            borderRadius: 25,
            borderWidth: 0.5,
            borderColor: "black",
            padding: 5,
            paddingHorizontal: 20,
          }}
        >
          <Icon name="search" size={20} color="white" />
          <TextInput
            style={{
              marginLeft: 10,
              color: "white",
              flex: 1,
            }}
            placeholder="Searching.."
            placeholderTextColor={"gray"}
            onChangeText={(data) => debouncedSearchGroups(data)}
          />
        </View>
      </View>
      {isSearching &&
        (isLoadingSearch ? (
          <View
            style={{
              borderTopColor: "#262626",
              borderWidth: 0.5,
              paddingTop: 20,
            }}
          >
            <UserSkeleton />
          </View>
        ) : searchedGroups.length > 0 ? (
          <View
            style={{
              borderTopColor: "#262626",
              borderWidth: 0.5,
              paddingTop: 5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "white",
                marginLeft: 20,
                marginTop: 10,
              }}
            >
              Results
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              data={searchedGroups}
              renderItem={({ item, index }) => {
                return (
                  <SearchGroupItems item={item} setSearchedGroups = {setSearchedGroups} searchedGroups={searchedGroups}/>
                );
              }}
              // renderItem={renderItems}
            />
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
                marginLeft: 20,
                marginTop: 10,
              }}
            >
              No search results
            </Text>
          </View>
        ))}
      {!isSearching &&
        (isLoadingSearch ? (
          <View
            style={{
              borderTopColor: "#262626",
              borderWidth: 0.5,
              paddingTop: 20,
            }}
          >
            <UserSkeleton />
          </View>
        ) : adminGroups?.length > 0 || memberGroups?.length > 0 ? (
          <View>
            {adminGroups.length > 0 && (
              <View
                style={{
                  borderTopColor: "#262626",
                  borderWidth: 0.5,
                  paddingTop: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "white",
                    marginLeft: 20,
                    marginTop: 10,
                  }}
                >
                  Your groups
                </Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  data={adminGroups}
                  renderItem={renderItems}
                />
              </View>
            )}
            {memberGroups?.length > 0 && (
              <View
                style={{
                  borderTopColor: "#262626",
                  borderWidth: 0.5,
                  paddingTop: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "white",
                    marginLeft: 20,
                    marginTop: 10,
                  }}
                >
                  All groups you have joined
                </Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  data={memberGroups}
                  renderItem={renderItems}
                />
              </View>
            )}
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
                marginLeft: 20,
                marginTop: 10,
              }}
            >
              You haven't joined the groups yet.
            </Text>
          </View>
        ))}
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
          { invitedGroups.length > 0 ?
          <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                data={invitedGroups}
                renderItem={({ item, index }) => {
                  return (
                    <InvitedGroupItem item={item} setMemberGroups={setMemberGroups} setInvitedGroups={setInvitedGroups}/>
                  );
                }}
                // renderItem={ModalItems}
              />
            </View>
          </View> : <View
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
              No invitations
            </Text>
          </View>}
        </View>
      </Modal>
      <Modal
        visible={modal}
        onRequestClose={() => setModal(false)}
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
                onPress={() => setModal(false)}
              />
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "white",
                padding: 10,
              }}
            >
              Name
            </Text>
            <TextInput
              style={form.textInput}
              value={name}
              onChangeText={(val) => setName(val)}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "white",
                padding: 10,
              }}
            >
              Description
            </Text>
            <TextInput
              style={[
                form.textInput,
                { minHeight: 150, textAlignVertical: "top", marginBottom: 20 },
              ]}
              placeholder="Bio"
              multiline={true}
              placeholderTextColor="gray"
              value={bio}
              onChangeText={(val) => setBio(val)}
            />

            <PrimaryButton onPress={handleCreateGroup}>Confirm</PrimaryButton>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: StatusBar.currentHeight || 0,
  },
  listItem: {
    paddingVertical: 8,
    marginVertical: 0,
    backgroundColor: "#000",
  },
  name: {
    fontSize: 14,
    color: "#fff",
  },
  subtitle: {
    fontSize: 12,
    color: "#A8A8A8",
  },
  button: {
    position: "absolute",
    bottom: 15,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
export default Group;
