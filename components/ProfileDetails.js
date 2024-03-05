import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import { Touchable } from "react-native";

const ProfileDetails = () => {
    return (
        <View style={{paddingHorizontal: 15}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15}}>
                <Image style={{height: 80, width: 80, borderRadius: 50}} source={require('../assets/logo.jpg')}/>
                <View style={{width: 75, alignItems: 'center'}}>
                    <Text style={{fontSize: 24, fontWeight: '500', color: 'white'}}> 4</Text>
                    <Text style={{fontSize: 16, fontWeight: '500', color: 'white'}}> Posts</Text>
                </View>
                <View style={{width: 75, alignItems: 'center'}}>
                    <Text style={{fontSize: 24, fontWeight: '500', color: 'white'}}> 4</Text>
                    <Text style={{fontSize: 16, fontWeight: '500', color: 'white'}}> Friends</Text>
                </View>
                <View style={{width: 75, alignItems: 'center'}}>
                    <Text style={{fontSize: 24, fontWeight: '500', color: 'white'}}> 4</Text>
                    <Text style={{fontSize: 16, fontWeight: '500', color: 'white'}}> Requests</Text>
                </View>
            </View>
            <Text style={{fontSize: 18, fontWeight: '400', color: 'white'}}> Posts</Text>
            <Text style={{fontSize: 14, fontWeight: '400', color: 'white'}}> Bio...</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-beetwen', alignItems: 'center', marginTop: 15, marginHorizontal: 10}}>
                <TouchableOpacity style={{flex: 1}}>
                    <Text style={{backgroundColor: '#1D1B1B', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, textAlign: 'center', color: 'white',fontSize: 14, fontWeight: '400', color: 'white'}}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default ProfileDetails;