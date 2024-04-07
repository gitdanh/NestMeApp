import defaultAvatar from '../assets/default-avatar.jpg';
import React, { useState}  from 'react';
import { View,TouchableOpacity, Text, TextInput } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Avatar } from 'react-native-elements';
import { useSelector } from "react-redux";
function Comment({post}){
    const [text, setText] = useState("")
    const avatar = useSelector((state) => state.authenticate.avatar);
    return (
        <View style={{flex: 1}}>
            <View>
                <View style={{flexDirection: "row", padding: 20}}>
                    <Avatar source={post.creator.profile_picture === ""
                            ? defaultAvatar : { uri: post.creator.profile_picture }} rounded size={45} /> 
                    <View style={{flexDirection: "column", marginLeft: 20, marginTop: -4}}>
                        <Text style={{color:"white", fontSize: 15, fontWeight: 700}}>duongw</Text>
                        <Text style={{color:"white", fontSize: 14, fontWeight: 400, flexWrap: "wrap", maxWidth: "91%"}}>duongwddddsdsdsadasdasdasdasdsadsadasd222saasd</Text>
                        <Text style={{color:"gray", fontSize: 14, fontWeight: 400}}>Reply</Text>
                    </View>
                </View>
                {/* Reply comment */}
                <View style={{flexDirection: "row", paddingLeft: 40, paddingRight: 20}}>
                        <Avatar source={post.creator.profile_picture === ""
                                ? defaultAvatar : { uri: post.creator.profile_picture }} rounded size={30} /> 
                        <View style={{flexDirection: "column", marginLeft: 15, marginTop: -4}}>
                            <Text style={{color:"white", fontSize: 14, fontWeight: 700}}>duongw</Text>
                            <Text style={{color:"white", fontSize: 13, fontWeight: 400, flexWrap: "wrap", maxWidth: "92%"}}>duongwddddsdsdsdasdasdasdasdsadsadasd222saasd</Text>
                            <Text style={{color:"gray", fontSize: 13, fontWeight: 400}}>Reply</Text>
                        </View>  
                </View>  
            </View>
            <View
            style={{
                width: "100%",
                position: "absolute",
                backgroundColor: "black",
                bottom: 0,
                elevation: 5,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 15,
                paddingHorizontal: 15,
                justifyContent: "space-evenly",
                borderWidth: 0.5,
                borderTopColor: "#262626",
                alignSelf: "center",
            }}
          >
            <Avatar source={avatar === ""
                            ? defaultAvatar : { uri: avatar }} rounded size={30} /> 
            <TextInput
              style={{
                width: "80%",
                color: "white",
                marginLeft: 10,
              }}
              placeholder="Comment.."
              placeholderTextColor={"gray"}
              multiline={true}
              value={text}
              onChangeText={(val) => setText(val)}
            />

            <TouchableOpacity
            >
              <Icon color="#fff" size={20} name="paper-plane-sharp" />
            </TouchableOpacity>
          </View>
        </View>
    )
}

export default Comment;