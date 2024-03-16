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
  const socket = useSelector((state) => state.chat.socket);
  const [isOnline, setIsOnline] = useState(data.online);
  const [lastOnl, setLastOnl] = useState(data.last_online);
  const socketEventRef = useRef(false);
  const [isEventRegistered, setIsEventRegistered] = useState(false);

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
            const response = await messageService.getMessages(data._id, msg?.length, user._id);
        
            if (response) {
                setMsg((prev) => [...prev, ...response.reverse()]);
            }
        } catch (err) {
            console.error("messages ", err);
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
            />

            <TouchableOpacity
              disabled={disabled}
              //    onPress={sendMsg}
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
