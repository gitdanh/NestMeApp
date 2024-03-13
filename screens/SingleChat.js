//import liraries
import Icon from "react-native-vector-icons/Ionicons";
import React, { useEffect, useState } from 'react';
import { ListItem, Avatar } from 'react-native-elements';
import { View, Text, StyleSheet, ImageBackground, TextInput, SectionList, TouchableOpacity, FlatList } from 'react-native';
import MsgComponent from '../components/Chat/MsgComponent';
import IconAwe from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as messageService from '../services/messageService';
// create a component


const SingleChat = (props) => {

    const { data } = props.route.params;
    const user ={
        _id: "65470a2248bc9d59982c2ddc"
      }
    // console.log("token",token)

    const [msg, setMsg] = useState([]);
    const [update, setupdate] = useState(false);
    const [disabled, setdisabled] = useState(false);
    const [allChat, setallChat] = useState([]);
    const [fetching, setFetching] = useState(false);
    useEffect(() => {
        setFetching(true);
        // console.log("day" + fetching + isLoadingMsg);
        // console.log("Current_Chat",currentChat._id);
        // console.log("messages",messages);
        const fetchData = async () => {
          try {
            // console.log("Current_Chat",currentChat._id);
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
        //   console.log(msg)
        
      }, []);


    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <IconMaterialCommunityIcons color={"white"} size={30} name="keyboard-backspace" style={{marginRight: 10}} />
                    <Avatar source={{ uri: 'https://m.media-amazon.com/images/M/MV5BOTU3NDE5MDQ4MV5BMl5BanBnXkFtZTgwMzE5ODQ3MDI@._V1_.jpg' }} 
                            rounded title={'duong'} size="small" />
                    <View style={{marginLeft: 10}}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: '#fff',
                        }}>duong</Text>
                        <Text style={{fontSize: 12,color: '#888888'}}>
                            online
                        </Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <IconAwe color={"white"} size={25} name="plus-square" style={{marginRight: 10}} />
                    <IconFeather color={"white"} size={25} name="menu" />
                </View>
            </View>
            <FlatList
                style={{ flex: 1}}
                data={msg}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index}
                inverted
                renderItem={({ item }) => {
                    return (
                        <MsgComponent
                            sender={item.sender_id === user._id}
                            message={item.content}
                            item={item}
                        />
                    )
                }}
            />
            <View style={{flexDirection: 'row',justifyContent: 'center', marginVertical: 10}}>
                <View
                    style={{
                        width: '95%',
                        backgroundColor: '#262626', 
                        elevation: 5,
                        // height: 60,
                        flexDirection:'row',
                        alignItems:'center',
                        paddingVertical:7,
                        justifyContent:'space-evenly',
                        borderRadius:25,
                        borderWidth:0.5,
                        borderColor: 'black',
                        
                    }}
                >

                    <TextInput
                        style={{
                            width:'80%',
                            color: 'white',
                        }}
                        placeholder = "Type a message"
                        placeholderTextColor = {'gray'}
                        multiline = {true}
                    />

                <TouchableOpacity
                disabled={disabled}
                //    onPress={sendMsg}
                >
                    <Icon color="#fff" size={20} name="paper-plane-sharp" />
                </TouchableOpacity>

                </View>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: 40,
    },
});

//make this component available to the app
export default SingleChat;