import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Touchable,
  Pressable,
  Modal,
} from "react-native";
import axios from "axios";
import moment from "moment";
import PostDetailsModal from "./PostDetailsModal";

const ManagePostsScreens = () => {
  const [usersMostPost, setUsersMostPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NmZlZmNlZTIxZDdiYmQyZDk1YWEzZCIsInB3IjoiJDJiJDEwJG9TZ3NOaWpDbVN3Rks0WkpTZ0NtRi5lV0hVU0M1VUVwci9FTjQxMGZiUTJlbDVWaGVQT25DIiwiZm4iOiJOZ3V54buFbiBWxINuIEEiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNzEyMTE5NjI2LCJleHAiOjE3MTIxNDg0MjZ9.adekpgFG0VTXX3lnYYlkiJ5D-l7NTaYOCMO4MQlM4QQ";
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };
      const response = await axios.get(
        `https://nestme-server.onrender.com/api/admin/post?page=${currentPage}&limit=5&search=`,
        config
      );
      setAllPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const renderItemPost = ({ item }) => (
    <Pressable onPress={() => setModalVisible(true)}>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Image
            style={styles.profileImg}
            source={{
              uri:
                item.creator.profile_picture ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.creator.username}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.content}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.reacts_count}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.comments_count}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>
            {moment(item.created_at).format("DD/MM/YYYY")}
          </Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellText}>{item.visibility}</Text>
        </View>
        <View style={styles.cell}>
          <Text>{item.reports_count}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.containerTableView}>
      <View style={styles.header}>
        <View style={styles.headercontainer}>
          <Text style={styles.heading}>Avatar</Text>
        </View>
        <View style={styles.headercontainer}>
          <Text style={styles.heading}>Username</Text>
        </View>
        <View style={styles.headercontainer}>
          <Text style={styles.heading}>Title</Text>
        </View>
        <View style={styles.headercontainer}>
          <Text style={styles.heading}>Likes</Text>
        </View>
        <View style={styles.headercontainer}>
          <Text style={styles.heading}>Comments</Text>
        </View>
        <View style={styles.headercontainer}>
          <Text style={styles.heading}>Created At</Text>
        </View>
        <View style={styles.headercontainer}>
          <Text style={styles.heading}>Status</Text>
        </View>
        <View style={styles.headercontainer}>
          <Text style={styles.heading}>Reports</Text>
        </View>
      </View>
      <FlatList
        data={allPosts}
        keyExtractor={(item) => item._id}
        renderItem={renderItemPost}
        onEndReached={() => setCurrentPage((prevPage) => prevPage + 1)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (
          <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreButtonText}>
              {isLoading ? "Loading..." : "Loadmore"}
            </Text>
          </TouchableOpacity>
        )}
      />
      <PostDetailsModal
        isVisible={isModalVisible}
        post={selectedPost}
        onClose={closeModal}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.headerModalContainers}>
              <Text style={styles.modalHeaderText}>Post</Text>
            </View>
            <View style={styles.bodyModalContainers}>
              <View style={styles.avatarPost}>
                <Image
                  style={styles.imgModalAvatar}
                  source={{
                    uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  }}
                />

                <Text style={styles.modalHeaderText}>Post</Text>
              </View>
              <View style={styles.viewPostModal}>
                <Image
                  style={styles.postImageMain}
                  source={{
                    uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  }}
                />
              </View>
            </View>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManagePostsScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,
    paddingBottom: 50,
    paddingLeft: 20,
    paddingRight: 20,
    // backgroundColor: "#1A3461",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 8,
    marginRight: 5,
  },
  legendText: {
    color: "black",
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  gridItem: {
    flex: 1,
    backgroundColor: "#264653",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  gridContent: {
    color: "white",
    marginTop: 5,
  },
  containerTableView: {
    marginTop: 10,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  head: { height: 44, backgroundColor: "darkblue" },
  /////////////////
  headercontainer: {
    flex: 1,
    alignItems: "center",
    elevation: 2,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 0,
    padding: 9,
  },
  ///////////////////////
  headText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  text: { margin: 6, fontSize: 16, fontWeight: "bold", textAlign: "center" },
  headerTopBar: {
    backgroundColor: "#6AB7E2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 2,
    marginBottom: 15,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  headerTopBarText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "space-between",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    // marginLeft: 15,
  },
  heading: { fontWeight: "bold", fontSize: 8.2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 2,
    elevation: 1,
    borderRadius: 3,
    borderColor: "#fff",
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "black",
    shadowOffset: { width: 5, height: 7 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cell: {
    flex: 1,
    alignItems: "center",
  },
  cellText: { fontSize: 8 },
  profileImg: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  loadMoreButton: {
    alignItems: "center",
    padding: 17,
  },
  loadMoreButtonText: { color: "blue", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu đen nhạt với độ trong suốt 50%
  },
  headerModalContainers: { flex: 0.5 },
  modalHeaderText: { fontSize: 16, textAlign: "center" },
  bodyModalContainers: {
    flex: 8,
  },
  avatarPost: {
    flex: 0.9,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
  },
  viewPostModal: {
    flex: 9,
  },
  imgModalAvatar: {
    height: 25,
    width: 25,
    borderRadius: 40,
    marginHorizontal: 7,
  },
  postImageMain: { height: 250, width: "auto" },
  modalView: {
    width: 350,
    height: 400,
    backgroundColor: "white",
    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    modalBody: { flex: 7 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
