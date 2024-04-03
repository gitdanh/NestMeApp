import { Feather } from '@expo/vector-icons';
import { Video } from 'expo-av';
import AntDesign from "react-native-vector-icons/AntDesign";
import React, { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, StatusBar, TextInput, KeyboardAvoidingView,  TouchableOpacity, View } from 'react-native';
import { Snackbar } from 'react-native-paper';





function Save(props) {
    const [caption, setCaption] = useState("")
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    const [data, setData] = useState("")
    const [keyword, setKeyword] = useState("")


    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <Feather style={navbar.image} name="check" size={24} color="green" onPress={() => { uploadImage() }} />
            ),
        });
    }, [caption]);

    const uploadImage = async () => {
        // if (uploading) {
        //     return;
        // }
        // setUploading(true)
        // let downloadURLStill = null
        // let downloadURL = await SaveStorage(props.route.params.source, `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`)

        // if (props.route.params.imageSource != null) {
        //     downloadURLStill = await SaveStorage(props.route.params.imageSource, `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`)
        // }

        // savePostData(downloadURL, downloadURLStill);

    }

    // const SaveStorage = async (image, path) => {
    //     if (image == 'default') {
    //         return '';
    //     }

    //     const fileRef = firebase.storage().ref()
    //         .child(path);

    //     const response = await fetch(image);
    //     const blob = await response.blob();

    //     const task = await fileRef.put(blob);

    //     const downloadURL = await task.ref.getDownloadURL();

    //     return downloadURL;
    // }

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
                    
                        {/* <View style={[{ marginBottom: 20, width: '100%' }]}>
                            <MentionsTextInput
                                textInputStyle={{ borderColor: '#ebebeb', borderWidth: 1, padding: 5, fontSize: 15, width: '100%' }}
                                suggestionsPanelStyle={{ backgroundColor: 'rgba(100,100,100,0.1)' }}
                                loadingComponent={() => <View style={{ flex: 1, width: 200, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>}
                                textInputMinHeight={30}
                                textInputMaxHeight={80}
                                trigger={'@'}
                                triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
                                value={caption}
                                onChangeText={setCaption}
                                triggerCallback={callback.bind(this)}
                                renderSuggestionsRow={renderSuggestionsRow.bind(this)}
                                suggestionsData={data}
                                keyExtractor={(item, index) => item.username}
                                suggestionRowHeight={45}
                                horizontal={true}
                                MaxVisibleRowCount={3}
                            />
                        </View> */}
                        <View style={{borderColor: "#262626"}}>
                            {props.route.params.type ?

                                <Image
                                    style={container.image}
                                    source={{ uri: props.route.params.source }}
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
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}>Share</Text>
                        </TouchableOpacity>
                        </View>
                        
                    </View>
                    <Snackbar
                        visible={error}
                        duration={2000}
                        onDismiss={() => setError(false)}>
                        Something Went Wrong!
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