import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

const ManageUsersScreen = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", banned: false },
    { id: 2, name: "Jane Smith", email: "jane@example.com", banned: false },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", banned: true },
  ]);
  const [searchText, setSearchText] = useState("");
  const [filterBanned, setFilterBanned] = useState(false);

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const banUser = (id) => {
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, banned: true };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        Alert.alert("User Details", `Name: ${item.name}\nEmail: ${item.email}`);
      }}
      onLongPress={() => {
        if (!item.banned) {
          Alert.alert(
            "Ban User",
            "Are you sure you want to ban this user?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Ban", onPress: () => banUser(item.id) },
            ],
            { cancelable: true }
          );
        }
      }}
    >
      <View
        style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
      >
        <Text style={{ fontSize: 18 }}>{item.name}</Text>
        <Text style={{ fontSize: 14, color: "#666" }}>{item.email}</Text>
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
        user.name.toLowerCase().includes(searchLowerCase) ||
        user.email.toLowerCase().includes(searchLowerCase)
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
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No users found</Text>}
      />
    </View>
  );
};

export default ManageUsersScreen;
