
import * as notificationsService from "../services/notificationService";    
import { useSelector, useDispatch} from "react-redux";
import { ListItem, Avatar } from 'react-native-elements';
import React, { useEffect, useState, useRef }  from 'react';
import { View, FlatList, StatusBar, StyleSheet, TouchableOpacity, Text, TextInput ,
  ActivityIndicator} from 'react-native';
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather";
import  { UserSkeleton }  from '../components/UserSkeleton';
import defaultAvatar from '../assets/default-avatar.jpg';
import { CommonActions, useNavigation } from '@react-navigation/native';

function Notify() {   
  const [decisionLoading, setDecisionLoading] = useState(null);
    const [notification, setNotification] = useState([]); 
    const [isPetching, setIsPetching] = useState(false);
    const navigation = useNavigation();
    const userId = useSelector((state) => state.authenticate.userId);
    const user ={
        _id: userId
    }
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
    const renderItems = ({ item }) => {
      console.log(item?.content == " has been a member of your group" ||  item?.content == " want to join ");
        return (
          <>
          {item.group_id ? 
            (<ListItem
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
                        // onPress={n?.content === " want to join " ? handleAcceptMember : handleAcceptGroup}
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
                        // onPress={n?.content === " want to join " ? handleRejectMember : handleRejectGroup}
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
                      <TouchableOpacity style={{ flex: 0.4, marginRight: 30}}>
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
                      <TouchableOpacity style={{ flex: 0.4 }}>
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
              /> : (<View style={{flex: 1, alignItems: "center"}}> 
              <Text style={{ color: "#A8A8A8", fontWeight: "500", fontSize: 14 }}>No Notifications</Text>
              </View>)) : ( <UserSkeleton/>)
            }
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