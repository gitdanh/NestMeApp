
import * as notificationsService from "../services/notificationService";   
import { acceptAddFriend, rejectAddFriend } from "../services/userService"; 
import { deleteToGroup, acceptToGroup, acceptRequestToGroup, rejectRequestToGroup } from "../services/groupService";
import { useSelector, useDispatch} from "react-redux";
import { ListItem, Avatar } from 'react-native-elements';
import React, { useEffect, useState, useRef, useCallback }  from 'react';
import { View, FlatList, StatusBar, StyleSheet, TouchableOpacity, Text, TextInput ,
  ActivityIndicator} from 'react-native';
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather";
import  { UserSkeleton }  from '../components/UserSkeleton';
import defaultAvatar from '../assets/default-avatar.jpg';
import { CommonActions, useNavigation } from '@react-navigation/native';

import usePrivateHttpClient from "../axios/private-http-hook";

function Notify() {   

  const { privateRequest } = usePrivateHttpClient();

  const [decisionLoading, setDecisionLoading] = useState(null);
  const [notification, setNotification] = useState([]); 
  const [isPetching, setIsPetching] = useState(false);
  const navigation = useNavigation();
  const userId = useSelector((state) => state.authenticate.userId);
  const user ={
      _id: userId
  }

  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreNotify, setHasMoreNotify] = useState(true);
  const [isEndReached, setIsEndReached] = useState(false);


    // Get messages ........................................

    const handleEndReached = () => {
        if (hasMoreNotify) {
          setPage((prev) => prev + 1);
          setIsEndReached(true);
        }
      };
    
    const getNotifies = useCallback(async () => {
        try {
            setLoadMore(true);
            const response = await notificationsService.getNotifications(user?._id, notification?.length);
            const notifyCount = response.length;
            setHasMoreNotify(notifyCount > 0 && notifyCount === 20);
            if (response) {
              setNotification((prev) => [...prev, ...response.reverse()]);
            }
        } catch (err) {
            console.error("messages ", err);
            setLoadMore(false);
        } finally {
          setLoadMore(false);
        }
    }, [page]);

  const lastNotifyRef = useCallback(
    (index) => {
      if (index === notification?.length - 1 && !isEndReached) {
        return {
          onLayout: () => setIsEndReached(false),
          ref: lastNotifyRef,
        };
      }
      return null;
    },
    [isEndReached, notification?.length]
  );

  useEffect(() => {
    getNotifies();
  }, [page]);

  useEffect(() => {
      const fetchData = async () => {
        try {
          setIsPetching(true)
          // console.log(user?._id);
          if (user) {
            const data = await notificationsService.getNotifications(
              user?._id,
              0
            );
            // const unreadCount = data.filter(
            //   (notification) => !notification.read
            // );
            // setUnreadNotification(unreadCount.length);
            setNotification(data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsPetching(false)
        }
      };
  
      fetchData();
    }, [user._id]);
  const renderItems = ({ item, index }) => {
    const handleAccept = async () => {
      try {
        setDecisionLoading("run");
        const response = await acceptAddFriend(
          item.sender_id,
          privateRequest
        );
        if (response.message) {
          setDecisionLoading("accept");
          socket.current.emit("sendNotification", {
            sender_id: user?._id,
            receiver_id: [item.sender_id],
            reponse: true,
            type: "accept",
          });
        }
      } catch (err) {
        console.error("accept", err);
        setDecisionLoading(false);
      }
    };
    const handleReject = async () => {
      try {
        setDecisionLoading("run");
        const response = await rejectAddFriend(
          item.sender_id,
          privateRequest
        );
        if (response.message) {
          setDecisionLoading("reject");
          socket.current.emit("sendNotification", {
            sender_id: user?._id,
            receiver_id: [item.sender_id],
            reponse: false,
            type: "reject",
          });
        }
      } catch (err) {
        console.error("reject ", err);
        setDecisionLoading(false);
      }
    };
  
    const handleAcceptGroup = async () => {
      try {
        setDecisionLoading("run");
        const response = await acceptToGroup(
          item.group_id,
          privateRequest
        );
        if (response !== null) {
          setDecisionLoading("accept");
          socket.current.emit("sendNotification", {
            sender_id: user?._id,
            receiver_id: [item.sender_id],
            group_id: item.group_id,
            reponse: true,
            type: "acceptGroup",
          });
        }
      } catch (err) {
        console.error("accept", err);
        setDecisionLoading(false);
      }
    };
    const handleRejectGroup = async () => {
      try {
        setDecisionLoading("run");
        const response = await deleteToGroup(
          n.group_id,
          privateRequest
        );
        if (response !== null) {
          setDecisionLoading("reject");
          socket.current.emit("sendNotification", {
            sender_id: user?._id,
            receiver_id: [item.sender_id],
            group_id: item.group_id,
            reponse: false,
            type: "rejectGroup",
          });
        }
      } catch (err) {
        console.error("reject ", err);
        setDecisionLoading(false);
      }
    };
  
    const handleAcceptMember = async () => {
      try {
        setDecisionLoading("run");
        const response = await acceptRequestToGroup(
          item.group_id,
          item.sender_id,
          privateRequest
        );
  
        if (response.message) {
          setDecisionLoading("accept");
          socket.current.emit("sendNotification", {
            sender_id: user?._id,
            receiver_id: [item.sender_id],
            group_id: item.group_id,
            reponse: true,
            type: "acceptMember",
          });
        }
      } catch (err) {
        console.error("accept", err);
        setDecisionLoading(false);
      }
    };
    const handleRejectMember = async () => {
      try {
        setDecisionLoading(true);
        const response = await rejectRequestToGroup(
          item.group_id,
          item.sender_id,
          privateRequest
        );
  
        if (response.message) {
          setDecisionLoading("reject");
          socket.current.emit("sendNotification", {
            sender_id: user?._id,
            receiver_id: [item.sender_id],
            group_id: item.group_id,
            reponse: false,
            type: "rejectMember",
          });
        }
      } catch (err) {
        console.error("reject ", err);
        setDecisionLoading(false);
      }
    };
    return (
      <>
      {item.group_id ? 
        (<ListItem
            {...lastNotifyRef(index)}
            containerStyle={styles.listItem}
            onPress={() => navigation.navigate('SingleChat', { data: item })}
        >
            <View>
            {item?.content == " has been a member of your group" ||  item?.content == " want to join " ?
              <Avatar source={!item.img 
                ? defaultAvatar : { uri: item.img }} rounded size="medium" />
              : <Avatar source={{ uri: item.group_cover }} style={{borderRadius: 10}}  size="medium" />
            }
            </View>
            <ListItem.Content style={styles.content}>
              <View style={styles.titleSubtitleContainer}>
                <Text>
                  {item.senderName != "administrator" && <Text style={styles.name}>{item.senderName}</Text>}
                  <Text style={styles.subtitle}>{decisionLoading
                    ? decisionLoading === "accept"
                      ? " is accepted by you"
                      : " is rejected by you"
                    : (item?.content === " want to join " ? (item?.content + item.group_name) : item?.content)}</Text>
                </Text>
              </View>
              {(!item.content_id && !item.reponse && item.reponse !== false) &&
                (decisionLoading ? (
                  decisionLoading === "run" ? (
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "10px",
                      }}
                    >
                      <ActivityIndicator/>
                    </View>
                  ) : null
                ) : ( 
                  <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 5
                  }}
                >
                  <TouchableOpacity 
                    style={{ flex: 0.4, marginRight: 30}}
                    onPress={item?.content === " want to join " ? handleAcceptMember : handleAcceptGroup}
                  >
                    <Text
                      style={{
                        backgroundColor: "#0866ff",
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                        borderRadius: 5,
                        textAlign: "center",
                        color: "white",
                        fontSize: 14,
                        fontWeight: "400",
                        color: "white",
                      }}
                    >
                      Accept
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{ flex: 0.4 }}
                    onPress={item?.content === " want to join " ? handleRejectMember : handleRejectGroup}
                  >
                    <Text
                      style={{
                        backgroundColor: "#1D1B1B",
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                        borderRadius: 5,
                        textAlign: "center",
                        color: "white",
                        fontSize: 14,
                        fontWeight: "400",
                        color: "white",
                      }}
                    >
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ListItem.Content>
            
          </ListItem>) :
          (<ListItem
            {...lastNotifyRef(index)}
            containerStyle={styles.listItem}
            onPress={() => navigation.navigate('SingleChat', { data: item })}
          >
            <View>
              <Avatar source={!item.img 
                ? defaultAvatar : { uri: item.img }} rounded size="small" />
            </View>
            <ListItem.Content style={styles.content}>
              <View style={styles.titleSubtitleContainer}>
                <Text>
                  {item.senderName != "administrator" && <Text style={styles.name}>{item.senderName}</Text>}
                  <Text style={styles.subtitle}>
                    {decisionLoading
                    ? decisionLoading === "accept"
                      ? " is accepted by you"
                      : " is rejected by you"
                    : item.content}</Text>
                </Text>
              </View>
              {(!item.content_id && !item.reponse && item.reponse !== false) &&
                (decisionLoading ? (
                  decisionLoading === "run" ? (
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "10px",
                      }}
                    >
                      <ActivityIndicator />
                    </View>
                  ) : null
                ) : ( 
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 5
                  }}
                >
                  <TouchableOpacity style={{ flex: 0.4, marginRight: 30}} onPress={handleAccept}>
                    <Text
                      style={{
                        backgroundColor: "#0866ff",
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                        borderRadius: 5,
                        textAlign: "center",
                        color: "white",
                        fontSize: 14,
                        fontWeight: "400",
                        color: "white",
                      }}
                    >
                      Accept
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 0.4 }} onPress={handleReject}>
                    <Text
                      style={{
                        backgroundColor: "#1D1B1B",
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                        borderRadius: 5,
                        textAlign: "center",
                        color: "white",
                        fontSize: 14,
                        fontWeight: "400",
                        color: "white",
                      }}
                    >
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ListItem.Content>
          </ListItem>)
        }</>
    );
  };


  return (
    <View style={styles.container}>
      <View style={{padding: 10}} >
          <View style={{flexDirection: 'row'}}>
              <IconMaterialCommunityIcons color={"white"} size={30} name="keyboard-backspace" style={{marginRight: 10}} onPress={()=> navigation.navigate('Home')}/>
              <Text style={{fontSize: 24, fontWeight: '500', color: 'white'}}> Notifications</Text>
          </View>
      </View>
      { !isPetching ? (
        notification && notification?.length > 0 ?
        <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={notification}
            renderItem={renderItems}
            keyboardDismissMode={"interactive"}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
        /> : (<View style={{flex: 1, alignItems: "center"}}> 
        <Text style={{ color: "#A8A8A8", fontWeight: "500", fontSize: 14 }}>No Notifications</Text>
        </View>)) : ( <UserSkeleton/>)
      }
      {loadMore  && page > 1 && <ActivityIndicator />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: StatusBar.currentHeight || 0,
  },
  listItem: {
    paddingVertical: 8,
    marginVertical: 0,
    backgroundColor: '#000',
  },
  content: {
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSubtitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#A8A8A8',
  },
  button: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

export default Notify;