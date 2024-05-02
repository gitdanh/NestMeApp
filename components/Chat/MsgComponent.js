// import moment from 'moment';
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal, } from 'react-native';
import TimeDelivery from './TimeDelivery';
import { useSelector, useDispatch } from "react-redux";
import { updateMessageRemoves } from "../../store/redux/slices/chatSlice";
import { getAvatarSource } from "../../utils/getImageSource";
import IconAnt from "react-native-vector-icons/AntDesign";
import * as messageService from "../../services/messageService"
// import ImageSize from 'react-native-image-size';

const MsgComponent = (props) => {
    const dispatch = useDispatch()
    const { sender, item, currentChat } = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const messageRemoves = useSelector((state) => state.chat.messageRemoves);
    const socket = useSelector((state) => state.chat.socket);
    // useEffect(() => {
    //     console.log(item)
    //   }, []);
    const handleLongPress = () => {
        if (
            sender &&
            item.removed === false &&
            !messageRemoves?.includes(item._id)
        ) {
          setIsModalVisible(true);
        }
      };
    
    //   useEffect(() =>{
    //     console.log(messageRemoves)
    //   },[messageRemoves])

    const handleUnsent = async () => {
        console.log("id", item._id);
        try{
            const data = {
                messageId: item._id,
                conversationId: currentChat._id,
                recieve_ids: currentChat.userIds,
            }
            if(item._id){
                const result = await messageService.deleteMsg(data);
                socket.current.emit("delete-msg", data);
                dispatch(updateMessageRemoves(item._id));
            }
        } catch (err) {
          console.log(err);
        } finally {
          setIsModalVisible(false);
        }
    }
    return (
        <Pressable
            style={{ marginVertical: 0 }}
            onLongPress={handleLongPress}
        >
            {item.removed === true || messageRemoves?.includes(item._id) === true ? (<View
                    style={[styles.masBox, {
                        alignSelf: sender ? 'flex-end' : 'flex-start',
                        // borderWidth:1,
                        borderColor: "#666360",
                        borderWidth: 1,
                        paddingBottom: 7
                    }]}
                >
                    <Text style={{ paddingLeft: 5, color: '#666360', fontSize:12.5 }}>
                        Message unsent
                    </Text>
                </View>) : <View>
            {item.content? (
                <View
                    style={[styles.masBox, {
                        alignSelf: sender ? 'flex-end' : 'flex-start',
                        // borderWidth:1,
                        backgroundColor: sender ? '#3797f0' : '#262626'
                    }]}
                >
                    
                    <Text style={{ paddingLeft: 5, color: 'white', fontSize:12.5 }}>
                        {item.content}
                    </Text>
                    

                    <TimeDelivery
                        style={{alignSelf: sender ? 'flex-end' : 'flex-start',}}
                        sender={sender}
                        item={item}
                    />

                </View>
            ): null}
            {item.media && item.media.map((m, index) => {
                // ImageSize.getSize(m)
                //     .then(({ width, height }) => {
                //     const ratio = width / height;

                    return (
                        <View style={{alignSelf: sender ? 'flex-end' : 'flex-start', maxWidth: '45%', maxHeight: 200, marginRight: 20, }} key={index}>
                            <Image
                                style={[styles.media, { aspectRatio: 1 }]}
                                source={{ uri: m }}
                            />
                        </View>
                    );
                    // })
                    // .catch(error => {
                    // console.error('Error getting image size:', error);
                    // return null;
                    // });
            })}
            </View>}
            <Modal
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.centeredView}>
                    <View style={{ backgroundColor: "#262626", borderRadius: 10}}>
                        <Text style={{color: "rgb(237, 73, 86)", width: 200, padding: 15, borderBottomColor: "#4e4d4d", borderBottomWidth: 2, fontSize: 15, fontWeight: 500, textAlign: "center"}} onPress={handleUnsent}>Unsent</Text>
                        <Text style={{color: "white", width: 200, padding: 15, fontSize: 15, fontWeight: 500, textAlign: "center"}} onPress={() => setIsModalVisible(false)}>Cancel</Text>
                    </View>
                </View>
            </Modal>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
    masBox: {
        alignSelf: 'flex-end',
        marginHorizontal: 10,
        minWidth: 80,
        maxWidth: '80%',
        paddingHorizontal: 10,
        marginVertical: 5,
        paddingTop: 5,
        borderRadius: 8
    },
    media: {
        width: '100%',
        marginTop: 10,
        maxHeight: 200,
        borderRadius: 10,
        resizeMode: 'cover',
        borderColor: "#212121",
        borderWidth: 1,
        marginLeft: 10,
      },
});

export default MsgComponent;