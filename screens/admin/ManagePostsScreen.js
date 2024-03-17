import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

const ManagePostsScreen = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: "Post 1", content: "Content of Post 1" },
    { id: 2, title: "Post 2", content: "Content of Post 2" },
    { id: 3, title: "Post 3", content: "Content of Post 3" },
  ]);
  const [searchText, setSearchText] = useState("");

  const deletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        Alert.alert(
          "Post Details",
          `Title: ${item.title}\nContent: ${item.content}`
        );
      }}
      onLongPress={() => {
        Alert.alert(
          "Delete Post",
          "Are you sure you want to delete this post?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: () => deletePost(item.id) },
          ],
          { cancelable: true }
        );
      }}
    >
      <View
        style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
      >
        <Text style={{ fontSize: 18 }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: "#666" }}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredPosts = posts.filter((post) => {
    if (searchText.trim() !== "") {
      const searchLowerCase = searchText.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLowerCase) ||
        post.content.toLowerCase().includes(searchLowerCase)
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
      </View>
      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No posts found</Text>}
      />
    </View>
  );
};

export default ManagePostsScreen;
