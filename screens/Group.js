import defaultAvatar from '../assets/default-avatar.jpg';
import React, { useState}  from 'react';
import { View, StyleSheet, StatusBar, Image, TouchableOpacity, Text, ScrollView, TextInput} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Avatar } from 'react-native-elements';
import { useSelector } from "react-redux";
function Group() {
    const [text, setText] = useState("")
    const avatar = useSelector((state) => state.authenticate.avatar);
    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                }}
            >
                <Text style={{ flex: 1, fontSize: 20, fontWeight: "500", color: "white", textAlign: "center", marginLeft: 25 }}>
                    Groups
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                        color={"white"}
                        size={25}
                        name="add-circle-outline"
                        style={{ marginRight: 10 }}
                    />
                </View>
            </View>
            <View style={{ 
                display: "flex",
                alignItems:"center",
                justifyContent:'center',
                marginTop: 5,
                paddingBottom: 10, 
                borderBottomColor: "#262626", 
                borderWidth: 1}}>
                <View
                    style={{ 
                            elevation: 5,
                            alignItems:"center",
                            flexDirection:'row',
                            paddingVertical:7,
                            marginBottom: 10,
                            backgroundColor: 'rgb(38, 38, 38)',
                            width:'90%',
                            borderRadius:25,
                            borderWidth:0.5,
                            borderColor: 'black',
                            padding: 5,
                            paddingHorizontal: 20,
                    }}
                >
                    <Icon name="search" size={20} color="white" />
                    <TextInput
                        style={{
                            marginLeft: 10,
                            color: 'white',
                            flex: 1,
                        }}
                        placeholder = "Searching.."
                        placeholderTextColor = {'white'}
                        // onChangeText={data => debouncedSearchUsers(data)}
                    />
                </View>
            </View>
            <View style={{flex: 1}}>
                <View style={{flexDirection: "row", padding: 20}}>
                    <Image source={avatar === ""
                            ? defaultAvatar : { uri: avatar }} style={{borderRadius: 10, width: 40, height: 40}} /> 
                    <View style={{flexDirection: "column", marginLeft: 20}}>
                        <Text style={{color:"white", fontSize: 15, fontWeight: 700}}>duongw</Text>
                        <Text style={{color:"white", fontSize: 14, fontWeight: 400, flexWrap: "nowrap", maxWidth: "91%"}} numberOfLines={1}>duongwddddsdsdsadasdasdasdasdsadsadasd222saasd</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      paddingTop: StatusBar.currentHeight || 0,
    },
    listItem: {
      paddingVertical: 8,
      marginVertical: 0,
      backgroundColor: '#000',
    },
    name: {
      fontSize: 14,
      color: '#fff',
    },
    subtitle: {
      fontSize: 12,
      color: '#A8A8A8',
    },
    button: {
      position: 'absolute',
      bottom: 15,
      right: 15,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'gray',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
    },
});
export default Group;