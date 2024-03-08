import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";

const ProfileHeader = () => {
    return (
        <View style={{paddingHorizontal: 15, paddingTop: 30, height: 62, marginBottom: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{fontSize: 24, fontWeight: '500', color: 'white'}}> duongw</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon color={"white"} size={25} name="plus-square" style={{marginRight: 10}} />
                    <IconFeather color={"white"} size={25} name="menu" />
                </View>
            </View>
        </View>
    )
}
export default ProfileHeader;