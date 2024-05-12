import React, { useState } from "react";
import {
  View,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import * as usersService from "../services/userService";
import { UserSkeleton } from "../components/UserSkeleton";
import Ionicons from "react-native-vector-icons/Ionicons";
import defaultAvatar from "../assets/default-avatar.jpg";
import { useSelector } from "react-redux";

function Search() {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const authUsername = useSelector((state) => state.authenticate.username);
  const authUserId = useSelector((state) => state.authenticate.userId);

  const searchUsers = async (data) => {
    try {
      setIsLoadingSearch(true);
      let result;
      if (data.trim() !== "") {
        result = await usersService.searchUsers(data);
      } else {
        setUsers([]);
      }
      // console.log(result);
      if (result) {
        setUsers(result);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingSearch(false);
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

  const debouncedSearchUsers = debounce(searchUsers, 500);

  const renderItems = ({ item }) => {
    return (
      <ListItem
        containerStyle={styles.listItem}
        onPress={() => {
          navigation.setOptions({
            unmountOnBlur: false,
          });
          navigation.navigate(
            authUsername === item.username ? "Profile" : "OtherProfile",
            {
              isOwnProfile: authUsername === item.username ? true : false,
              username: item.username,
            }
          );
        }}
      >
        <View>
          <Avatar
            source={
              item.profile_picture === ""
                ? defaultAvatar
                : { uri: item.profile_picture }
            }
            rounded
            title={item.username}
            size="medium"
          />
        </View>
        <ListItem.Content>
          <ListItem.Title
            style={
              item.unread
                ? { fontSize: 15, color: "#fff", fontWeight: "800" }
                : styles.name
            }
          >
            {item.username}
          </ListItem.Title>
          <ListItem.Subtitle
            style={
              item.unread
                ? { fontSize: 13, color: "#fff", fontWeight: "800" }
                : styles.subtitle
            }
            numberOfLines={1}
          >
            {item.full_name}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          <Ionicons name="search" size={20} color="white" />
          <TextInput
            style={{
              marginLeft: 10,
              color: "white",
              flex: 1,
            }}
            placeholder="Searching.."
            placeholderTextColor={"white"}
            onChangeText={(data) => debouncedSearchUsers(data)}
          />
        </View>
      </View>
      {isLoadingSearch ? (
        <UserSkeleton />
      ) : users && users?.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={users}
          renderItem={renderItems}
        />
      ) : (
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#A8A8A8", fontWeight: "500", fontSize: 14 }}>
            No search results
          </Text>
        </View>
      )}
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
});

export default Search;
