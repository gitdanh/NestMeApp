//import liraries
import Icon from "react-native-vector-icons/Ionicons";
import React from 'react';
import { ListItem, Avatar } from 'react-native-elements';
import { View, Text, StyleSheet, ImageBackground, TextInput, SectionList, TouchableOpacity, FlatList } from 'react-native';
import MsgComponent from '../components/Chat/MsgComponent';
import IconAwe from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// create a component

const Data = [
    {
        message: 'Yes Ofcourse..',
        type: 'sender'
    },
    {
        message: 'How are You ?',
        type: 'sender'
    },
    {
        message: 'How Your Opinion about the one done app ?',
        type: 'sender'
    },
    {
        message: 'Well i am not satisfied with this design plzz make design better ',
        type: 'receiver'
    },
    {
        message: 'could you plz change the design...',
        type: 'receiver'
    },
    {
        message: 'How are You ?',
        type: 'sender'
    },
    {
        message: 'How Your Opinion about the one done app ?',
        type: 'sender'
    },
    {
        message: 'Well i am not satisfied with this design plzz make design better ',
        type: 'receiver'
    },
    {
        message: 'could you plz change the design...',
        type: 'receiver'
    },
    {
        message: 'How are You ?',
        type: 'sender'
    },
    {
        message: 'How Your Opinion about the one done app ?',
        type: 'sender'
    }
]


const SingleChat = (props) => {

    const { data } = props.route.params;

    // console.log("token",token)

    const [msg, setMsg] = React.useState('');
    const [update, setupdate] = React.useState(false);
    const [disabled, setdisabled] = React.useState(false);
    const [allChat, setallChat] = React.useState([]);


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
                data={Data}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index}
                inverted
                renderItem={({ item }) => {
                    return (
                        <MsgComponent
                            sender={item.type == "sender"}
                            massage={item.message}
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
                        value={msg}
                        onChangeText={(val)=>setMsg(val)}
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