import defaultAvatar from '../assets/default-avatar.jpg';
import React, { useEffect, useState, useRef }  from 'react';
import { View, FlatList, StatusBar, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import { Avatar } from 'react-native-elements';
function Comment({post}){
    return (
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
    )
}

export default Comment;