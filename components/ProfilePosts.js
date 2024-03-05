import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";

const ProfilePosts = () => {
    const [selected, setSelected] = useState(1);
    const [data, setData] = useState([{
        id: 1, image: "https://i.pinimg.com/736x/6a/bf/27/6abf279c4a0055732325dbc3e7ec879d.jpg"
    }, {
        id: 2, image: "https://i.pinimg.com/236x/e9/fa/65/e9fa65bf29c5177f1b5040d0667f6ce8.jpg"
    }, {
        id: 2, image: "https://i.pinimg.com/236x/e9/fa/65/e9fa65bf29c5177f1b5040d0667f6ce8.jpg"
    },{
        id: 1, image: "https://i.pinimg.com/736x/6a/bf/27/6abf279c4a0055732325dbc3e7ec879d.jpg"
    },])
    const renderItems = item =>{
        return(
            <View>
                <Image source={{uri: item.item.image}} style={{height: 123, width: 123,  marginRight: 3, marginBottom: 3}}/>
            </View>
        )
    }
    return (
        <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                    <View style={{width: '50%', paddingBottom: 15 , borderBottomWidth: selected === 1 ? 1: 0, borderBlockColor: 'white'}}>
                        <TouchableOpacity onPress={()=> setSelected(1)} style={{justifyContent: 'center', alignItems: 'center'}}>
                            <IconMaterial color={"gray"} size={25} name="grid-on" />
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '50%', paddingBottom: 15, borderBottomWidth: selected === 0 ? 1: 0, borderBlockColor: 'white'}}>
                        <TouchableOpacity onPress={()=> setSelected(0)} style={{justifyContent: 'center', alignItems: 'center'}}>
                            <IconFeather color={"gray"} size={25} name="bookmark" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {selected === 1 && (
                <FlatList data={data}
                renderItem={renderItems}
                keyExtractor={item => item.id.toString()}
                numColumns={3}
                showsHorizontalScrollIndicator={false}/>
                
            )}
        </View>
    )
}
export default ProfilePosts;