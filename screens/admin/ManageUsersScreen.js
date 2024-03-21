import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";

const ManageUsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterBanned, setFilterBanned] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://nestme-server.onrender.com/api/admin/user?page=1&limit=9&search",
        {
          headers: {
            Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NmZlZmNlZTIxZDdiYmQyZDk1YWEzZCIsInB3IjoiJDJiJDEwJG9TZ3NOaWpDbVN3Rks0WkpTZ0NtRi5lV0hVU0M1VUVwci9FTjQxMGZiUTJlbDVWaGVQT25DIiwiZm4iOiJOZ3V54buFbiBWxINuIEEiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNzEwOTA2NTY3LCJleHAiOjE3MTA5MzUzNjd9.vsDkCcSUsEbJsiFDRCKUw1XryHtaHvZwFgt0i9SW_d0"}`,
          },
        }
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteUser = (id) => {
    // Thực hiện xóa người dùng ở phía client nếu cần
    setUsers(users.filter((user) => user._id !== id));
  };

  const banUser = (id) => {
    // Thực hiện cấm người dùng ở phía client nếu cần
    const updatedUsers = users.map((user) => {
      if (user._id === id) {
        return { ...user, banned: true };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        Alert.alert(
          "User Details",
          `Name: ${item.full_name}\nEmail: ${item.user_info.email}`
        );
      }}
      onLongPress={() => {
        if (!item.banned) {
          Alert.alert(
            "Ban User",
            "Are you sure you want to ban this user?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Ban", onPress: () => banUser(item._id) },
            ],
            { cancelable: true }
          );
        }
      }}
    >
      <View
        style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
      >
        <Text style={{ fontSize: 18 }}>{item.full_name}</Text>
        <Text style={{ fontSize: 14, color: "#666" }}>
          {item.user_info.email}
        </Text>
        {item.banned && <Text style={{ color: "red" }}>Banned</Text>}
      </View>
    </TouchableOpacity>
  );

  const filteredUsers = users.filter((user) => {
    if (filterBanned && !user.banned) {
      return false;
    }
    if (searchText.trim() !== "") {
      const searchLowerCase = searchText.toLowerCase();
      return (
        user.full_name.toLowerCase().includes(searchLowerCase) ||
        user.user_info.email.toLowerCase().includes(searchLowerCase)
      );
    }
    return true;
  });

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            paddingHorizontal: 10,
          }}
          placeholder="Search"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
        <TouchableOpacity onPress={() => setFilterBanned(!filterBanned)}>
          <Text
            style={{ fontSize: 16, color: filterBanned ? "blue" : "black" }}
          >
            Show Banned
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={<Text>No users found</Text>}
      />
    </View>
  );
};

export default ManageUsersScreen;
