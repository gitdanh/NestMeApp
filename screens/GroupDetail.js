import React, { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, ScrollView, Image, Alert, StatusBar, TouchableOpacity } from "react-native";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import defaultCover from '../assets/default-cover.jpg';
function GroupDetail(props) {
    const { data } = props.route.params;
    const [selected, setSelected] = useState(0);
    return (
        <View style={styles.container}>
           <Image source={data.cover === "/static-resources/default-cover.jpg"
                        ? defaultCover : { uri: data.cover }} style={{borderRadius: 20, width: "100%", height: 240}} /> 
            <View style={{padding: 10}}>
                <Text style={{color: "white", fontSize: 25, fontWeight: 600, marginBottom: 7}}>{data.name}</Text>
                <View style={{flexDirection: "row", marginBottom: 7}}>
                    <Text style={{color: "white", fontSize: 15, fontWeight: 700, marginRight: 20}}>1 Posts</Text>
                    <Text style={{color: "white", fontSize: 15, fontWeight: 700, marginRight: 20}}>2 Members</Text>
                </View>
                <Text style={{color: "#A8A8A8", fontSize: 14, fontWeight: 500}}>{data.description}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems:"center", justifyContent: "center", paddingBottom: 20}}>
                <TouchableOpacity style={{width: "40%", backgroundColor: "#363636", padding: 10, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: "5%"}}><Text style={{color:"white", fontSize: 14, fontWeight: 500}}>Create Post</Text></TouchableOpacity>
                <TouchableOpacity style={{width: "40%", backgroundColor: "#0095f6", padding: 10, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: "5%"}}><Text style={{color:"white", fontSize: 14, fontWeight: 500}}>Invite</Text></TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <Ionicons color={"white"} size={22} name="ellipsis-horizontal" />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 5,
                }}
            >
                <View
                    style={{
                        paddingBottom: 15,
                        borderBottomWidth: selected === 1 ? 1 : 0,
                        borderBlockColor: "white",
                        width: 120,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setSelected(1)}
                        style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
                    >
                        <IconMaterial color={selected === 1 ? "white" : "gray"} size={22} name="grid-on" />
                        <Text style={{color: selected === 1 ? "white" : "gray", fontSize: 16, fontWeight: 700, marginLeft: 5}}>Post</Text>
                    </TouchableOpacity>
                    </View>
                <View
                    style={{
                        width: 120,
                        paddingBottom: 10,
                        borderBottomWidth: selected === 0 ? 1 : 0,
                        borderBlockColor: "white",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setSelected(0)}
                        style={{ justifyContent: "center", alignItems: "center", flexDirection: "row"}}
                    >
                        <Ionicons color={selected === 0 ? "white" : "gray"} size={25} name="ellipsis-horizontal-circle-outline" />
                        <Text style={{color: selected === 0 ? "white" : "gray", fontSize: 16, fontWeight: 700, marginLeft: 5}}>Pending</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      paddingTop: StatusBar.currentHeight || 0,
    },
})
export default GroupDetail;