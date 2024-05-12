import React, { useState, useCallback, useEffect } from "react";
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

export const InvitedGroupItem = ({ item, setMemberGroups, setInvitedGroups }) => {
    console.log(item.cover);
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)
    const {privateRequest} = usePrivateHttpClient();
    const socket = useSelector((state) => state.chat.socket);
    const userId = useSelector((state) => state.authenticate.userId);
    const avatar = useSelector((state) => state.authenticate.avatar);
    const user = {
        _id: userId,
        avatar: avatar,
    };
    const handleDeleteToGroup = async () => {
        if(!loading){
            setLoading(true);
            try {
                const respone = await deleteToGroup(
                  item._id,
                  privateRequest
                );
                if (respone !== null) {
                    setStatus("Rejected");
                    setLoading(false);
                    setTimeout(() => {
                        setInvitedGroups(prev => prev.filter(group => group._id !== item._id));
                      }, 5000);
                    socket.current.emit("sendNotification", {
                        sender_id: user._id,
                        receiver_id: [item.owner],
                        group_id: item._id,
                        reponse: false,
                        type: "rejectGroup",
                    });
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }
    };

    const handleAcceptToGroup = async () => {
        if(!loading){
            setLoading(true);
            console.log(item._id);
            try {
                const respone = await acceptToGroup(
                item._id,
                privateRequest
                );
                if (respone !== null) {
                    setStatus("Accepted");
                    const newgroup = {_id: item._id, name: item.name, cover: item.cover, status: "MEMBER"}
                    setMemberGroups(prev => [...prev, newgroup])
                    setLoading(false);
                    socket.current.emit("sendNotification", {
                        sender_id: user._id,
                        receiver_id: [item.owner],
                        group_id: item._id,
                        reponse: true,
                        type: "acceptGroup",
                      });
                }
                console.log(respone);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }
    };
    return (
      <View style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: "row", paddingVertical: 15 }}>
          <Image
            source={getGroupCoverUrl(item?.cover)}
            style={{ width: 40, height: 40, borderRadius: 10 }}
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
        </View>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        {status !== "" ? 
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "#A8A8A8",
                marginLeft: 20,
                marginTop: 10,
              }}
            >
              {status}
            </Text>
          : <>
          <TouchableOpacity
            style={{
              width: "45%",
              backgroundColor: "#0095f6",
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginRight: "10%",
            }}
            onPress={handleAcceptToGroup}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "45%",
              backgroundColor: "#ff6666",
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleDeleteToGroup}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: 500 }}>
              Reject
            </Text>
          </TouchableOpacity>
          </>}
        </View>
      </View>
    );
}