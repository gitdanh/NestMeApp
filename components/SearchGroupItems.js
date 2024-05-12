import React, { useState, useCallback, useEffect,forwardRef } from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
} from "react-native";
import usePrivateHttpClient from "../axios/private-http-hook";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
    deleteToGroup,
    requestToGroup,
  } from "../services/groupService";
  import { getGroupCoverUrl } from "../utils/getGroupCoverUrl";
export const SearchGroupItems = ({ item, setSearchedGroups, searchedGroups }) => {
    const navigation = useNavigation();
    const {privateRequest} = usePrivateHttpClient();
    const [status, setStatus] = useState(item.status);
    const [loading, setLoading] = useState(false);
    const socket = useSelector((state) => state.chat.socket);
    const userId = useSelector((state) => state.authenticate.userId);
    const avatar = useSelector((state) => state.authenticate.avatar);
    const user = {
        _id: userId,
        avatar: avatar,
    };
    useEffect(()=>{
      console.log(status);
    },[status])
    const handleRequestToGroup = async () => {
      setLoading(true);
      try {
        const respone = await requestToGroup(
          item._id,
          privateRequest
        );
        if (respone !== null) {
          console.log(user._id + item.owner)
          setLoading(false);
          const updatedGroups = [...searchedGroups];
          const updatedIndex = updatedGroups.findIndex((group) => group.id === item._id);
          if (updatedIndex !== -1) {
            updatedGroups[updatedIndex].status = "REQUESTED";
          }
          // Cập nhật lại state searchedGroups
          setSearchedGroups(updatedGroups);
          setStatus("REQUESTED");
          console.log("log ne",status);
          socket.current.emit("sendNotification", {
            sender_id: user._id,
            receiver_id: [item.owner],
            group_id: item._id,
            type: "requestGroup",
          });
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
  
    const handleDeleteToGroup = async () => {
      setLoading(true);
      console.log("delete");
      try {
        const respone = await deleteToGroup(
          item._id,
          privateRequest
        );
        if (respone !== null) {
          const updatedGroups = [...searchedGroups];
          const updatedIndex = updatedGroups.findIndex((group) => group.id === item._id);
          if (updatedIndex !== -1) {
            updatedGroups[updatedIndex].status = null;
          }
          // Cập nhật lại state searchedGroups
          setSearchedGroups(updatedGroups);
          setStatus(null);
          console.log("log ne",status);
          socket.current.emit("sendNotification", {
            sender_id: user._id,
            receiver_id: [item.owner],
            group_id: item._id,
            reponse: false,
            type: "rejectGroup",
          });
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    const handleButton = async () => {
      if (!loading) {
        if (status) {
          if (status === "ADMIN" || status === "MEMBER") {
            navigation.navigate("GroupDetail", { groupId: item._id })
          } else if (status === "REQUESTED") {
            handleDeleteToGroup();
          } 
        } else {
          handleRequestToGroup();
        }
      }
    };
    return (
      <>
      {status !== "INVITED" &&
      <TouchableOpacity
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}
        onPress={() =>{
          if(status || status === "REQUESTED" || status === null)
            navigation.navigate("GroupDetail", { groupId: item._id })
          }
        }
      >
        <Image
          source={getGroupCoverUrl(item.cover)}
          style={{ borderRadius: 10, width: 40, height: 40 }}
        />
        <View style={{ flexDirection: "column", marginLeft: 20 }}>
          <Text style={{ color: "white", fontSize: 15, fontWeight: 700 }}>
            {item.name}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontWeight: 400,
              flexWrap: "nowrap",
              maxWidth: "100%",
            }}
            numberOfLines={1}
          >
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>}
      {(!status || status === null || status ==="REQUESTED") &&
        <View style={{width: "100%", alignItems: "center", justifyContent: "center"}}>
          <TouchableOpacity
              style={{
                width: "80%",
                backgroundColor: status === "REQUESTED" ? "#363636" : "#0095f6",
                padding: 10,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleButton}
            >
              <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
                {status === "REQUESTED" ? "Requested" : "Request to join"}
              </Text>
            </TouchableOpacity>
          </View>}
      </>
    );
}