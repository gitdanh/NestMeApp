import React, { useEffect, useState, useRef }  from 'react';
import { View, FlatList, StatusBar, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as conversationService from '../services/conversationService';
import  { UserSkeleton }  from '../components/UserSkeleton';
import defaultAvatar from '../assets/default-avatar.jpg';
import { useSelector, useDispatch} from "react-redux";
import { setAccessToken } from "../store/redux/slices/authSlice";

function Chat() {
  const [conversations, setConversations] = useState([]);
  
  const userId = useSelector((state) => state.authenticate.userId);
  const socket = useSelector((state) => state.chat.socket);
  const user ={
    _id: userId
  }
  const [search, setSearch] = useState('')
    const navigation = useNavigation();
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [isPetching, setIsPetching] = useState(false);
    const [ unread , setUnread] = useState(false);
    
    const socketEventRef = useRef(false);
    const searchCons = async (data) => {
      try {
          setIsLoadingSearch(true);
          let result;
          if(data===""){
              result = await conversationService.getUserConversations(user._id);
          } else{
              if(data.trim() !== ""){
                  result = await conversationService.searchCons(user._id, data.trim());
              }    
          }
          // console.log(result);
          if (result) {
            setConversations(result)
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
    
    const debouncedSearchCons = debounce(searchCons, 500);


    useEffect(() => {
      if(user){
          const fetchData = async () => {
              try {
                  setIsPetching(true);
                  const data = await conversationService.getUserConversations(user._id);
                  setConversations(data)
                  // setConversation(data);
              } catch (error) {
                  setIsPetching(false);
                  console.error(error);
              } finally {
                  setIsPetching(false);
              }
          };
          fetchData();
      }
    }, []);

    // useEffect(() => {
    //     // console.log(socket, currentChat._id);
    //     // console.log(checkCurrentChatIdRef.current);
    //     if(socket){
    //       // console.log("toi socket");
    //       if (socket.current && !socketEventRef.current) {
    //         socket.current.on("return-recieve", (data) => handleReturnChat(data));
    //         socketEventRef.current = true;
    //       }
    //     }
    //   }, [socket?.current]);
    
    // const handleReturnChat = async (data) => {
    //     console.log(data);
    //     // const result = await conversationService.getUserConversations(user._id);
    //     // console.log(result);
    //     // dispatch({ type: "SET_CONVERSATIONS", payload: result });
    //     dispatch({
    //       type: "ADD_CONVERSATION",
    //       payload: data
    //     });
    // };
    
    // useEffect(() => {
    //     console.log(conversations);
    // }, [conversations]);

    useEffect(() => {
      if(socket){
          socket.current.on("getOnlineUser", (data) => {
            setConversations((prevConversations) => {
              return prevConversations.map((con) => {
                if (con.userIds == data.user_id) {
                  return { ...con, online: true };
                } else {
                  return con;
                }
              });
            });
          });
      }
    }, [socket?.current]);

    useEffect(() => {
        if(socket){
            socket.current.on("getOfflineUser", (data) => {
              setConversations((prevConversations) => {
                return prevConversations.map((con) => {
                  if (con.userIds == data.user_id) {
                    return { ...con, online: false };
                  } else {
                    return con;
                  }
                });
              });
            });
        }
    }, [socket?.current]);

    useEffect(() => {
      if(socket){
          socket.current.on("msg-recieve", (data) => {
            setConversations((prevConversations) => {
              return prevConversations.map((con) => {
                if (con._id == data.conversationId) {
                  let lastmsg;
                  if(data?.media.length > 0)
                    lastmsg = "Image";
                  else
                    lastmsg = data.content;
                  return { ...con, lastMsg: lastmsg, unread: true };
                } else {
                  return con;
                }
              });
            });
          });
      }
    }, [socket?.current]);

    const renderItems = ({ item }) => {
      
      return (
        <ListItem
          containerStyle={styles.listItem}
          onPress={() => navigation.navigate('SingleChat', { data: item })}
        >
          <View>
            <Avatar source={item.img === ""
                      ? defaultAvatar : { uri: item.img }} rounded title={item.name} size="medium" />
            {}
            {item.online ? 
            <View style={{position: "absolute", width: 12, height: 12, borderRadius: 50, backgroundColor: "green", left: "75%", bottom: 2}}></View>
            : null}
          </View>
          <ListItem.Content>
            <ListItem.Title style={item.unread ? { fontSize: 15, color: '#fff', fontWeight: "800"} : styles.name}>{item.name}</ListItem.Title>
            <ListItem.Subtitle style={item.unread ? { fontSize: 13, color: '#fff', fontWeight: "800"} : styles.subtitle} numberOfLines={1}>
              {item.lastMsg}
            </ListItem.Subtitle>
          </ListItem.Content>
          {item.unread ? (<View style={{ width: 10, height: 10, marginRight: 10, borderRadius: 50, backgroundColor: "#0095f6"}}></View>):null}
        </ListItem>
      );
    };
  
    const navigateToAllUser = () => {
      navigation.navigate('AllUser');
    };
  
    return (
      <View style={styles.container}>
        <View style={{padding: 10}} >
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <IconMaterialCommunityIcons color={"white"} size={30} name="keyboard-backspace" style={{marginRight: 10}} onPress={()=> navigation.navigate('Home')}/>
              <Text style={{fontSize: 24, fontWeight: '500', color: 'white'}}> duongw</Text>
            </View>
              
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon color={"white"} size={25} name="plus-square" style={{marginRight: 10}} />
                <IconFeather color={"white"} size={25} name="menu" />
            </View>
          </View>
        </View>
        <View
          style={{ 
              elevation: 5,
              // height: 60,
              flexDirection:'row',
              alignItems:'center',
              paddingVertical:7,
              marginBottom: 10,
              justifyContent:'space-evenly'
          }}
        >
          <TextInput
            style={{
                backgroundColor: 'rgb(38, 38, 38)',
                width:'90%',
                borderRadius:25,
                borderWidth:0.5,
                borderColor: 'black',
                padding: 5,
                paddingHorizontal: 20,
                color: 'white',
            }}
            placeholder = "Searching.."
            placeholderTextColor = {'white'}
            onChangeText={data => debouncedSearchCons(data)}
          />
        </View>
        {isLoadingSearch ? ( <UserSkeleton/>) :
          (  !isPetching ? (
            conversations && conversations?.length > 0 ?
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              data={conversations}
              renderItem={renderItems}
            /> : (<View style={{flex: 1, alignItems: "center"}}> 
            <Text style={{ color: "#A8A8A8", fontWeight: "500", fontSize: 14 }}>No messages</Text>
          </View>)) : ( <UserSkeleton/>))
        }
        <TouchableOpacity style={styles.button} onPress={navigateToAllUser}>
          <Icon color="#fff" size={20} name="users" />
        </TouchableOpacity>
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
    name: {
      fontSize: 14,
      color: '#fff',
    },
    subtitle: {
      fontSize: 12,
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
  
  export default Chat;
