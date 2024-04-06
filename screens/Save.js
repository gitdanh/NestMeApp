import { Feather } from '@expo/vector-icons';
import { Video } from 'expo-av';
import AntDesign from "react-native-vector-icons/AntDesign";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, StatusBar, TextInput, KeyboardAvoidingView,  TouchableOpacity, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import {
    getDownloadURL,
    ref,
    storage,
    uploadBytesResumable,
} from "../configs/firebase";
import usePrivateHttpClient from "../axios/private-http-hook";
import { createPost } from "../services/postServices";
import { useSelector, useDispatch} from "react-redux";



function Save(props) {
    const privateHttpClient = usePrivateHttpClient();
    const [caption, setCaption] = useState("")
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarNotif, setSnackBarNotif] = useState({
        severity: "success",
        message: "This is success message!",
      }); //severity: success, error, info, warning
    const userId = useSelector((state) => state.authenticate.userId);
    const socket = useSelector((state) => state.chat.socket);
    const user ={
        _id: userId
    }
    useEffect(() => {
        console.log(props.route.params.source)
    }, []);
    


    const handleCreatePost = async () => {
        setUploading(true);
        let images = props.route.params.source;
        const promises = images.map(async (image) => {
          const name = Date.now();
          const storageRef = ref(storage, `images/${name}`);
          const response = await fetch(image);
          const blob = await response.blob();
          const uploadTask = uploadBytesResumable(storageRef, blob);
    
          return new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              null,
              (error) => {
                console.log(error);
                reject(error);
                setUploading(false);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((url) => {
                    console.log(url);
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
        let createdPostId;
        try {
          const urls = await Promise.allSettled(promises);
          const urlStrings = urls.map((url) => url.value.toString());
    
          const postData = { title: caption, urlStrings };
          const response = await createPost(
            postData,
            privateHttpClient.privateRequest
          );
    
          if (response !== null) {
            createdPostId = response.post._id;
            socket.current.emit("sendNotification", {
              sender_id: user?._id,
              receiver_id: user?.friends,
              content_id: createdPostId,
              type: "post",
            });
            setCaption("");
            setUploading(false);
            setSnackBarNotif({
              severity: "success",
              message: "Create success",
            });
            setSnackBarOpen(true);
          }
        } catch (err) {
            setUploading(false);
            setSnackBarNotif({
            severity: "error",
            message: "Create fail with message: " + err,
          });
          setSnackBarOpen(true);
          console.log(err);
        } finally {
            props.navigation.navigate('Home');
        }
    };

    return (
        <View style={[container.container, {backgroundColor: "black"}]}>
            <View style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 15, display: "flex", flexDirection:"row", alignItems:"center", justifyContent: "space-between", borderBottomColor: "#262626", borderWidth: 1}}>
                    <View style={{display: "flex", flexDirection:"row", alignItems:"center"}}>
                        <AntDesign color={"white"} size={27} name="arrowleft" onPress={() => props.navigation.navigate("Create")}/>
                        <Text style={{fontSize: 16, fontWeight: '700', color: 'white', marginLeft: 15}}> New Post</Text>
                    </View>
                </View>
            {uploading ? (
                <View style={[container.container, {justifyContent: 'center', alignItems: "center"}]}>
                    <ActivityIndicator style={{marginBottom: 20}} size="large" />
                    <Text style={{fontWeight: '700', fontSize: 20}}>Upload in progress...</Text>
                </View>
            ) : (
                <View style={{flex: 1}}>
                    <View style={{backgroundColor: "black"}}>
                        <View style={{borderColor: "#262626"}}>
                            {props.route.params.type ?

                                <Image
                                    style={container.image}
                                    source={{ uri: props.route.params.source[0] }}
                                    styles={{ aspectRatio: 1 / 1, backgroundColor: 'black' }}
                                />

                                :

                                <Video
                                    source={{ uri: props.route.params.source }}
                                    shouldPlay={true}
                                    isLooping={true}
                                    resizeMode="cover"
                                    style={{ aspectRatio: 1 / 1, backgroundColor: 'black' }}
                                />
                            }
                        </View>
                        
                        <TextInput
                            value={caption}   
                            onChangeText={(val) => setCaption(val)}
                            style={{
                                padding: 10,
                                paddingHorizontal: 20,
                                color: 'white',
                                fontSize: 14, 
                                marginBottom: 20
                            }}
                            placeholder = "Write your caption...."
                            placeholderTextColor = {'gray'}
                            multiline={true}
                        />
                        <View style={{
                            
                            display: "flex",
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity style={{
                                width: "90%",
                                borderRadius: 10,
                                backgroundColor: "#0095f6",
                                padding: 10,
                                paddingHorizontal: 20,
                                color: 'white',
                                fontSize: 14,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: 'center'
                            }} onPress={handleCreatePost}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}>Share</Text>
                        </TouchableOpacity>
                        </View>
                        
                    </View>
                    <Snackbar
                        visible={snackBarOpen}
                        duration={2000}
                        onDismiss={() => setSnackBarOpen(false)}>
                        {snackBarNotif.message}
                    </Snackbar>
                    
                </View>

            )}

        </View>

    )
}
const container = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',  
        paddingTop: StatusBar.currentHeight || 0,
    },
    containerImage: {
        flex: 1 / 3
    },
    image: {
        aspectRatio: 1 / 1,
    },
})
const navbar = StyleSheet.create({
    image: {
        padding: 20
    },
    custom: {
        marginTop: 30,
        height: 60,
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: 1,
        borderColor: 'lightgrey'
    },

    title: {
        fontWeight: '700',
        fontSize: 20//'larger',
    }
})

export default Save;