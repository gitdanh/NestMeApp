//import liraries
import Icon from "react-native-vector-icons/Ionicons";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ListItem, Avatar } from "react-native-elements";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  SectionList,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import MsgComponent from "../components/Chat/MsgComponent";
import IconAwe from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as messageService from "../services/messageService";
import defaultAvatar from "../assets/default-avatar.jpg";
import { useSelector } from "react-redux";
import { calculatedTime } from "../utils/calculatedTime";
// create a component

const SingleChat = (props) => {
  const navigation = useNavigation();
  const { data } = props.route.params;
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
            const response = await messageService.getMessages(data._id, msg?.length, user._id);
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
            if(data._id && user._id){
              const result = await messageService.getMessages(data._id, 0, user._id);
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
      if(data){
          socket.current.on("getOfflineUser", (off) => {
              if(data.userIds.includes(off.user_id)){
                  setIsOnline(false);
                  setLastOnl(new Date().toISOString());
              }
          });
      }
  }, [socket?.current, data]);


  useEffect(() => {
      if(socket){
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
            setMsg((prevMsg) => [msgRecieve, ...prevMsg]);
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

  // readers ........................................

  useEffect(() => {
      const addReader = async () => {
          const reader = {
              conversation_id: data._id,
              reader_id: user._id,
          }
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
  const [img, setImg] = useState([])
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if((text.trim() !== "" || img.length != 0) && sending == false){
      // const promises = img.map((image) => {
      //   const name = Date.now();
      //   const storageRef  = ref(storage,`images/${name}`);
      //   const uploadTask = uploadBytesResumable(storageRef, image.file);
      //   return new Promise((resolve, reject) => {
      //     uploadTask.on('state_changed', 
      //     (snapshot) => {
      //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //         setProgress(progress);
      //       },
      //       (error) => {
      //         console.log(error);
      //         reject(error);
      //       },
      //       () => {
      //         // console.log("Toi r");
      //         getDownloadURL(uploadTask.snapshot.ref)
      //         .then((url) => {
      //           // console.log(url);
      //           resolve(url);
      //         })
      //         .catch((error) => {
      //           console.log(error);
      //           reject(error);
      //         });
      //       }
      //     );
      //   });
      // });
      
      try{
        setSending(true);
        // const urls = await Promise.allSettled(promises)
        // const urlStrings = urls.map((url) => url.value.toString());
        urlStrings = [];
        try{
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
          const savedMessage = {_id: result._id, ...newMessage};
          if(data?.is_deleted && data?.is_deleted.find(obj => obj.user_id === data.userIds[0] && obj.deleted === true)){
            const data = {
              conversationId: data._id,
              userId: data.userIds[0],
            }
            let last_msg;
            if(result?.media.length > 0){
              last_msg = "Image";
            } else{
              last_msg = result?.content;
            }
            console.log(text, last_msg);
            const con = {_id: data._id, userIds: [user._id], name: user.full_name, img: user.profile_picture, 
              msg_id: result._id, lastMsg: last_msg, unread: true, online: true, last_online: data.last_online,
              is_deleted: data.is_deleted,recieve_ids: data.userIds,
            };
            console.log(con);
            conversationService.returnConversation(data);
            socket.current.emit("return-chat", con);
          } else{
            socket.current.emit("send-msg", savedMessage)
          }

          
          // dispatch({ type: "FIRST_CONVERSATION", payload: currentChat });
          setMsg((prevMsg) => [savedMessage, ...prevMsg]);
          // dispatch({type: "ADD_MESSAGE", payload: savedMessage,
          //   fromSelf: true,
          // })
          
          if (result !== null) {
            setText("") ;
            setImg([]);
          }
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setSending(false);
      }
      // await ReturnHeight();
    }
  };

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
              navigation.navigate("Chat");
              setMsg([]);
            }}
          />
          <View>
            <Avatar
              source={data.img === "" ? defaultAvatar : { uri: data.img }}
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
          <IconAwe
            color={"white"}
            size={25}
            name="plus-square"
            style={{ marginRight: 10 }}
          />
          <IconFeather color={"white"} size={25} name="menu" />
        </View>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={45}
        behavior="padding"
        enabled={Platform.OS === "ios"}
      >
        {loadMore  && page > 1 && <ActivityIndicator />}
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
                message={item.content}
                {...lastMessageRef(index)}
                item={item}
              />
            );
          }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
        />

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
              justifyContent: "space-evenly",
              borderRadius: 25,
              borderWidth: 0.5,
              borderColor: "black",
              alignSelf: "center",
            }}
          >
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
              disabled={disabled}
              onPress={handleSendMessage}
            >
              <Icon color="#fff" size={20} name="paper-plane-sharp" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 40,
  },
});

//make this component available to the app
export default SingleChat;
