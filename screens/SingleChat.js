//import liraries
import Icon from "react-native-vector-icons/Ionicons";
import IconEntypo from "react-native-vector-icons/Entypo";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ListItem, Avatar } from "react-native-elements";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import MsgComponent from "../components/Chat/MsgComponent";
import IconAwe from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as messageService from "../services/messageService";
import * as conversationService from "../services/conversationService";
import defaultAvatar from "../assets/default-avatar.jpg";
import { useSelector, useDispatch } from "react-redux";
import { calculatedTime } from "../utils/calculatedTime";
import { Audio } from "expo-av";
import { Camera } from "expo-camera/legacy";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/native";
import { container, utils } from "../styles/authStyle";
import { updateMessageRemoves } from "../store/redux/slices/chatSlice";
import {
  getDownloadURL,
  ref,
  storage,
  uploadBytesResumable,
} from "../configs/firebase";
const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);
// create a component

const SingleChat = (props) => {
  const [data, setData] = useState(props.route.params.data);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.authenticate.userId);
  const avatar = useSelector((state) => state.authenticate.avatar);
  const socket = useSelector((state) => state.chat.socket);
  const [isOnline, setIsOnline] = useState(data.online);
  const [lastOnl, setLastOnl] = useState(data.last_online);
  const socketEventRef = useRef(false);
  const [isEventRegistered, setIsEventRegistered] = useState(false);

  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreMsg, setHasMoreMsg] = useState(true);
  const [isEndReached, setIsEndReached] = useState(false);

  // Get messages ........................................

  const handleEndReached = () => {
    if (hasMoreMsg) {
      setPage((prev) => prev + 1);
      setIsEndReached(true);
    }
  };

  const getMessages = useCallback(async () => {
    try {
      setLoadMore(true);
      const response = await messageService.getMessages(
        data._id,
        msg?.length,
        user._id
      );
      const msgCount = response.length;
      setHasMoreMsg(msgCount > 0 && msgCount === 20);
      if (response) {
        setMsg((prev) => [...prev, ...response.reverse()]);
      }
    } catch (err) {
      console.error("messages ", err);
      setLoadMore(false);
    } finally {
      setLoadMore(false);
    }
  }, [page]);

  const lastMessageRef = useCallback(
    (index) => {
      if (index === msg?.length - 1 && !isEndReached) {
        return {
          onLayout: () => setIsEndReached(false),
          ref: lastMessageRef,
        };
      }
      return null;
    },
    [isEndReached, msg?.length]
  );

  useEffect(() => {
    getMessages();
  }, [page]);

  const user = {
    _id: userId,
    avatar: avatar,
  };

  const [msg, setMsg] = useState([]);
  const [disabled, setdisabled] = useState(false);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    setFetching(true);
    const fetchData = async () => {
      try {
        if (data._id && user._id) {
          const result = await messageService.getMessages(
            data._id,
            0,
            user._id
          );
          setMsg(result.reverse());
        }
      } catch (error) {
        console.log(error);
        setFetching(false);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [data._id]);

  // sockets ........................................

  useEffect(() => {
    if (data) {
      socket.current.on("getOnlineUser", (onl) => {
        if (data.userIds.includes(onl.user_id) && onl.user_id != user._id) {
          setIsOnline(true);
        }
      });
    }
  }, [socket?.current, data]);

  useEffect(() => {
    if (data) {
      socket.current.on("getOfflineUser", (off) => {
        if (data.userIds.includes(off.user_id)) {
          setIsOnline(false);
          setLastOnl(new Date().toISOString());
        }
      });
    }
  }, [socket?.current, data]);

  useEffect(() => {
    if (socket) {
      if (socket.current && !socketEventRef.current && !isEventRegistered) {
        socket.current.on("msg-recieve", (msg) => handleMsgRecieve(data, msg));
        socketEventRef.current = true;
        setIsEventRegistered(true);
      }
    }
  }, [data._id, socket.current, isEventRegistered]);

  const handleMsgRecieve = (c, msgRecieve) => {
    if (c) {
      if (msgRecieve.conversationId === c._id) {
        const isDuplicate = msg.some(
          (message) => message._id === msgRecieve._id
        );
        if (!isDuplicate) {
          setMsg((prevMsg) => [msgRecieve, ...prevMsg]);
        }
        const reader = {
          conversation_id: c._id, // Sửa thành 'c._id' thay vì 'data._id'
          reader_id: user._id,
        };
        (async () => {
          try {
            await messageService.addReader(reader);
          } catch (err) {
            console.log(err);
          }
        })();
      }
    }
  };

  useEffect(() => {
    // console.log(socket, currentChat._id);
    // console.log(checkCurrentChatIdRef.current);
    if (socket) {
      // console.log("toi socket", socket.current, socketEventRef.current);
      if (socket.current && socketEventRef.current) {
        socket.current.on("msg-deleted", (data) => handleMsgDeleted(data));
      }
    }
  }, [data, socket.current]);

  const handleMsgDeleted = (data) => {
    // console.log(data);
    dispatch(updateMessageRemoves(data.messageId));
  };

  useEffect(() => {
    if (socket) {
      // console.log("toi socket");
      if (socket.current) {
        socket.current.on("delete-recieve", (con) =>
          handleRecieveDeleteChat(con)
        );
      }
    }
  }, [socket?.current]);

  const handleRecieveDeleteChat = async (con) => {
    //console.log(con);
    setData(con);
  };

  // readers ........................................

  useEffect(() => {
    const addReader = async () => {
      const reader = {
        conversation_id: data._id,
        reader_id: user._id,
      };
      if (data.unread) {
        try {
          await messageService.addReader(reader);
        } catch (err) {
          console.log(err);
        }
      }
    };

    addReader();
  }, [data._id]);

  // Send messages ........................................
  const [text, setText] = useState("");
  const [img, setImg] = useState([]);
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if ((text.trim() !== "" || img.length != 0) && sending == false) {
      const promises = img.map(async (image) => {
        const name = Date.now() + Math.random();
        const storageRef = ref(storage, `images/${name}`);
        let imageSend = image;
        if (!isCaptured) {
          const loadedAsset = await MediaLibrary.getAssetInfoAsync(image);
          imageSend = loadedAsset.localUri;
        }
        const response = await fetch(imageSend);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(storageRef, blob);
        // promises.push(uploadTask);
        // console.log(promises);
        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
              console.log(error);
              reject(error);
            },
            () => {
              // console.log("Toi r");
              getDownloadURL(uploadTask.snapshot.ref)
                .then((url) => {
                  // console.log(url);
                  resolve(url);
                })
                .catch((error) => {
                  console.log(error);
                  reject(error);
                });
            }
          );
        });
      });
      try {
        setSending(true);
        const urls = await Promise.allSettled(promises);
        //console.log(urls);
        const urlStrings = urls.map((url) => url.value.toString());
        try {
          const newMessage = {
            conversationId: data._id,
            recieve_ids: data.userIds,
            sender_id: user._id,
            img: user.avatar,
            content: text,
            media: urlStrings,
            removed: false,
          };

          const result = await messageService.sendMessage(newMessage);
          const savedMessage = { _id: result._id, ...newMessage };
          if (
            data?.is_deleted &&
            data?.is_deleted.find(
              (obj) => obj.user_id === data.userIds[0] && obj.deleted === true
            )
          ) {
            const data = {
              conversationId: data._id,
              userId: data.userIds[0],
            };
            let last_msg;
            if (result?.media.length > 0) {
              last_msg = "Image";
            } else {
              last_msg = result?.content;
            }
            //console.log(text, last_msg);
            const isDeleted = data.is_deleted.map((deletedItem) => {
              if (deletedItem.user_id === data.userIds[0]) {
                return { ...deletedItem, deleted: false };
              }
              return deletedItem;
            });

            setData((prevData) => ({ ...prevData, is_deleted: isDeleted }));
            const con = {
              _id: data._id,
              userIds: [user._id],
              name: user.full_name,
              img: user.profile_picture,
              msg_id: result._id,
              lastMsg: last_msg,
              unread: true,
              online: true,
              last_online: data.last_online,
              is_deleted: isDeleted,
              recieve_ids: data.userIds,
            };
            // console.log(con);
            conversationService.returnConversation(data);
            socket.current.emit("return-chat", con);
          } else {
            socket.current.emit("send-msg", savedMessage);
          }
          setMsg((prevMsg) => [savedMessage, ...prevMsg]);
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setSending(false);
        setIsModalVisible(false);
        setText("");
        setImg([]);
        setIsCaptured(false);
      }
      // await ReturnHeight();
    }
  };

  //Xoa ............................................
  const [more, setMore] = useState(false);
  const handleDelete = async () => {
    console.log("xoa ne" + data._id);
    try {
      const info = {
        userId: user._id,
        conversationId: data._id,
      };
      await conversationService.deleteConversation(info);
      const isDeleted = item.is_deleted.map((deletedItem) => {
        if (deletedItem.user_id === user._id) {
          return { ...deletedItem, deleted: true };
        }
        return deletedItem;
      });
      setData((prevData) => ({ ...prevData, is_deleted: isDeleted }));
      const con = {
        _id: data._id,
        userIds: [user._id],
        name: user.full_name,
        img: user.profile_picture,
        msg_id: result._id,
        lastMsg: last_msg,
        unread: true,
        online: true,
        last_online: data.last_online,
        is_deleted: updatedData.is_deleted,
        recieve_ids: data.userIds,
      };

      socket.current.emit("delete-chat", con);
    } catch (error) {
      console.log(error);
    } finally {
      setMore(false);
      props.navigation.navigate("Chat", { con: data._id });
    }
  };

  //Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFlash, setIsFlash] = useState(false);
  const [showGallery, setShowGallery] = useState(true);
  const [galleryItems, setGalleryItems] = useState([]);
  const cameraRef = useRef();
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const cameraPermissions = await Camera.requestCameraPermissionsAsync();
      const galleryPermissions = await MediaLibrary.requestPermissionsAsync();

      const audioPermissions = await Audio.requestPermissionsAsync();
      if (
        cameraPermissions.status === "granted" &&
        audioPermissions.status === "granted" &&
        galleryPermissions.status === "granted"
      ) {
        const getPhotos = await MediaLibrary.getAssetsAsync({
          sortBy: ["creationTime"],
          mediaType: ["photo", "video"],
        });
        const modifiedUriPhotos = await Promise.all(
          getPhotos.assets.map(async (getPhoto) => {
            let uri = getPhoto.uri;
            if (Platform.OS === "ios") {
              const assetInfo = await MediaLibrary.getAssetInfoAsync(getPhoto);
              uri = assetInfo.localUri;
            }
            return { ...getPhoto, uri };
          })
        );

        setGalleryItems(modifiedUriPhotos);
        setHasPermission(true);
      }
    })();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        setIsCaptured(true);
        setImg((prev) => [...prev, source]);
      }
    }
  };

  const generateThumbnail = async (source) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(source, {
        time: 5000,
      });
      return uri;
    } catch (e) {
      console.warn(e);
    }
  };

  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const renderCaptureControl = () => (
    <View>
      <View
        style={{
          justifyContent: "space-evenly",
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: "black",
        }}
      >
        <TouchableOpacity
          disabled={!isCameraReady}
          onPress={() => setIsFlash(!isFlash)}
        >
          <IconFeather
            style={utils.margin15}
            name={"zap"}
            size={25}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!isCameraReady}
          onPress={takePicture}
          style={styles.capturePicture}
        />
        <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
          <IconFeather
            style={utils.margin15}
            name="rotate-cw"
            size={25}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingBottom: 5,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconMaterialCommunityIcons
            color={"white"}
            size={30}
            name="keyboard-backspace"
            style={{ marginRight: 10 }}
            onPress={() => {
              props.navigation.navigate("Chat", { con: data._id });
              setMsg([]);
            }}
          />
          <View>
            <Avatar
              source={data?.img === "" ? defaultAvatar : { uri: data?.img }}
              rounded
              title={"duong"}
              size="small"
            />
            {isOnline ? (
              <View
                style={{
                  position: "absolute",
                  width: 12,
                  height: 12,
                  borderRadius: 50,
                  backgroundColor: "green",
                  left: "75%",
                  bottom: 2,
                }}
              ></View>
            ) : null}
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#fff",
              }}
            >
              {data.name}
            </Text>
            <Text style={{ fontSize: 12, color: "#888888" }}>
              {isOnline
                ? "Active Now"
                : "Active " + calculatedTime(lastOnl) + " ago"}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconFeather
            color={"white"}
            size={25}
            name="menu"
            onPress={() => setMore(true)}
          />
        </View>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={45}
        behavior="padding"
        enabled={Platform.OS === "ios"}
      >
        {loadMore && page > 1 && <ActivityIndicator />}
        {msg && (
          <FlatList
            style={{ flex: 1 }}
            data={msg}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={"interactive"}
            keyExtractor={(item, index) => index.toString()}
            inverted
            renderItem={({ item, index }) => {
              return (
                <MsgComponent
                  sender={item.sender_id === user._id}
                  currentChat={data}
                  {...lastMessageRef(index)}
                  item={item}
                />
              );
            }}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
          />
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 10,
          }}
        >
          <View
            style={{
              width: "95%",
              backgroundColor: "#262626",
              elevation: 5,
              // height: 60,
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 7,
              paddingHorizontal: 15,
              justifyContent: "space-evenly",
              borderRadius: 25,
              borderWidth: 0.5,
              borderColor: "black",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              disabled={disabled}
              style={{ marginRight: 10 }}
              onPress={() => {
                setIsModalVisible(true), setShowGallery(false);
              }}
            >
              <IconFeather color={"gray"} size={25} name="camera" />
            </TouchableOpacity>
            <TextInput
              style={{
                width: "80%",
                color: "white",
              }}
              placeholder="Type a message"
              placeholderTextColor={"gray"}
              multiline={true}
              value={text}
              onChangeText={(val) => setText(val)}
            />

            <TouchableOpacity
              style={{ marginRight: 10 }}
              disabled={disabled}
              onPress={() => {
                setIsModalVisible(true), setShowGallery(true);
              }}
            >
              <IconEntypo color="#fff" size={20} name="images" />
            </TouchableOpacity>

            <TouchableOpacity disabled={disabled} onPress={handleSendMessage}>
              <Icon color="#fff" size={20} name="paper-plane-sharp" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
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
              <AntDesign
                color={"white"}
                size={27}
                name="close"
                onPress={() => {
                  setIsModalVisible(false);
                  setImg([]);
                }}
              />
            </View>
          </View>
          {hasPermission === null ? (
            <View />
          ) : hasPermission === false ? (
            <Text style={styles.text}>No access to camera</Text>
          ) : showGallery ? (
            <SafeAreaView style={{ flex: 1, marginBottom: 49 }}>
              <ScrollView
                style={[container.container, { backgroundColor: "black" }]}
              >
                <View
                  style={{ flex: 1, borderTopWidth: 1, borderColor: "#262626" }}
                >
                  <FlatList
                    scrollEnabled={false}
                    numColumns={3}
                    horizontal={false}
                    data={galleryItems}
                    contentContainerStyle={{
                      flexGrow: 1,
                    }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          container.containerImage,
                          {
                            borderLeftWidth: 2,
                            borderRightWidth: 2,
                            borderTopWidth: 2,
                            borderColor: "black",
                          },
                        ]}
                        onPress={() => {
                          if (img.includes(item))
                            setImg((prev) =>
                              prev.filter((image) => image !== item)
                            );
                          else setImg((prev) => [...prev, item]);
                        }}
                      >
                        <Image
                          style={container.image}
                          source={{ uri: item.uri }}
                        />
                        {img.includes(item) && (
                          <View
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              top: 0,
                              right: 0,
                              backgroundColor: "rgba(4, 3, 3, 0.8)",
                              zIndex: 2,
                            }}
                          >
                            <AntDesign
                              style={{
                                position: "absolute",
                                padding: 10,
                                bottom: 0,
                                right: 0,
                              }}
                              name="checkcircleo"
                              size={20}
                              color="blue"
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </ScrollView>
              {img?.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 10,
                    left: "10%",
                    right: "10%",
                    zIndex: 3,
                  }}
                >
                  {sending ? (
                    <ActivityIndicator size={40} />
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#0095f6",
                        borderRadius: 10,
                        padding: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={handleSendMessage}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 15,
                          fontWeight: 600,
                        }}
                      >
                        Send {img?.length}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </SafeAreaView>
          ) : (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                backgroundColor: "black",
              }}
            >
              <View style={[{ aspectRatio: 1 / 1, height: WINDOW_WIDTH }]}>
                {isCaptured ? (
                  <Image
                    style={[{ aspectRatio: 1 / 1, height: WINDOW_WIDTH }]}
                    source={{ uri: img[0] }}
                  />
                ) : isFocused ? (
                  <Camera
                    ref={cameraRef}
                    style={{ flex: 1 }}
                    type={cameraType}
                    flashMode={
                      isFlash
                        ? Camera.Constants.FlashMode.torch
                        : Camera.Constants.FlashMode.off
                    }
                    styles={[{ aspectRatio: 1 / 1, height: WINDOW_WIDTH }]}
                    ratio={"1:1"}
                    onCameraReady={onCameraReady}
                  />
                ) : null}
              </View>

              <View
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  },
                ]}
              >
                <View>{renderCaptureControl()}</View>
              </View>
              {isCaptured > 0 && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 30,
                    left: "10%",
                    right: "10%",
                    zIndex: 3,
                  }}
                >
                  {sending ? (
                    <ActivityIndicator size={40} />
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#0095f6",
                        borderRadius: 10,
                        padding: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={handleSendMessage}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 15,
                          fontWeight: 600,
                        }}
                      >
                        Send
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </Modal>

      <Modal
        visible={more}
        onRequestClose={() => setMore(false)}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={{ backgroundColor: "#262626", borderRadius: 10 }}>
            <Text
              style={{
                color: "rgb(237, 73, 86)",
                width: 200,
                padding: 15,
                borderBottomColor: "#4e4d4d",
                borderBottomWidth: 2,
                fontSize: 15,
                fontWeight: 500,
                textAlign: "center",
              }}
              onPress={handleDelete}
            >
              Delete
            </Text>
            <Text
              style={{
                color: "white",
                width: 200,
                padding: 15,
                fontSize: 15,
                fontWeight: 500,
                textAlign: "center",
              }}
              onPress={() => setMore(false)}
            >
              Cancel
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 40,
  },
  capture: {
    backgroundColor: "red",
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
  capturePicture: {
    borderWidth: 6,
    borderColor: "gray",
    backgroundColor: "white",
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
});

//make this component available to the app
export default SingleChat;
