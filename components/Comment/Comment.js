import { forwardRef, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import { getAvatarSource } from "../../utils/getImageSource";
import renderMentionLink from "../../utils/renderMentionLink";
import { useSelector } from "react-redux";
import {
  deletePostComment,
  getReplyComments,
} from "../../services/postServices";
import usePrivateHttpClient from "../../axios/private-http-hook";
import { useNavigation } from "@react-navigation/native";

const Comment = forwardRef(
  (
    {
      postId,
      comment,
      setComments,
      setReplyCommentId,
      setIsReply,
      setInitialText,
      replyComments,
      children_cmts_count,
      addReplyComments,
      deleteReplyComment,
      viewReplies,
      setViewReplies,
      inputRef,
    },
    ref
  ) => {
    const navigator = useNavigation();
    const { privateRequest } = usePrivateHttpClient();
    const authUsername = useSelector((state) => state.authenticate.username);

    const [viewRepliesLoading, setViewRepliesLoading] = useState(false);
    const [deleteCmt, setDeleteCmt] = useState(false);

    const handleViewReplies = async () => {
      setViewReplies(!viewReplies);
      if (!viewRepliesLoading) {
        try {
          setViewRepliesLoading(true);
          const response = await getReplyComments(
            postId,
            comment._id,
            1,
            300,
            privateRequest
          );
          if (response) {
            addReplyComments(comment._id, response.replies);
            setViewRepliesLoading(false);
          }
        } catch (err) {
          console.log("view replies: ", err);
          setViewRepliesLoading(false);
        }
      }
    };

    const replyClick = () => {
      setReplyCommentId(comment._id);
      setIsReply(true);
      setInitialText(`@${comment.user.username} `);
      inputRef.current.focus();
    };

    // const handleDeletePostComment = async () => {
    //   if (!reportLoading) {
    //     try {
    //       //setReportLoading(true);
    //       const response = await deletePostComment(comment._id, privateRequest);
    //       if (response.message) {
    //         setComments((prevComments) =>
    //           prevComments.filter(
    //             (prevComment) => prevComment._id !== props.comment._id
    //           )
    //         );
    //         if (deleteCmt) toggleDeleteCmt();
    //         //setReportLoading(false);
    //       }
    //     } catch (err) {
    //       //setReportLoading(false);
    //     }
    //   }
    // };

    return (
      <>
        <View style={{ flexDirection: "row", padding: 20 }}>
          <Avatar
            source={getAvatarSource(comment.user.profile_picture)}
            rounded
            size={45}
          />
          <View
            style={{ flexDirection: "column", marginLeft: 20, marginTop: -4 }}
          >
            <Text style={{ color: "white", fontSize: 15, fontWeight: 700 }}>
              {comment.user.username}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: 400,
                flexWrap: "wrap",
                maxWidth: "100%",
              }}
            >
              {renderMentionLink(comment.comment, navigator, authUsername)}
            </Text>
            {ref ? (
              <Text
                ref={ref}
                style={{ color: "gray", fontSize: 14, fontWeight: 400 }}
                onPress={replyClick}
              >
                Reply
              </Text>
            ) : (
              <Text
                style={{ color: "gray", fontSize: 14, fontWeight: 400 }}
                onPress={replyClick}
              >
                Reply
              </Text>
            )}
          </View>
        </View>
        {/* Reply comment */}
        {children_cmts_count > 0 && (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 85,
              width: "auto",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                borderColor: "#A8A8A8",
                borderWidth: 1,
                borderStyle: "solid",
                width: 20,
                height: 0,
                marginRight: 15,
              }}
            ></View>
            <Text
              style={{
                color: "#A8A8A8",
                fontWeight: "500",
                fontSize: 12,
              }}
              onPress={handleViewReplies}
            >
              {!viewReplies ? "View" : "Hide"} replies{" "}
              {!viewReplies && `(${children_cmts_count})`}
            </Text>
          </View>
        )}
        {viewReplies && viewRepliesLoading ? (
          <ActivityIndicator />
        ) : (
          viewReplies &&
          children_cmts_count > 0 && (
            <FlatList
              data={replyComments}
              renderItem={({ item, i }) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      paddingLeft: 40,
                      paddingRight: 20,
                      marginVertical: 10,
                    }}
                  >
                    <Avatar
                      source={getAvatarSource(item.user.profile_picture)}
                      rounded
                      size={40}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        marginLeft: 15,
                        marginTop: -4,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {item.user.username}
                      </Text>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 13,
                          fontWeight: 400,
                          flexWrap: "wrap",
                          maxWidth: "100%",
                        }}
                      >
                        {renderMentionLink(
                          item.comment,
                          navigator,
                          authUsername
                        )}
                      </Text>
                      <Text
                        style={{ color: "gray", fontSize: 13, fontWeight: 400 }}
                        onPress={replyClick}
                      >
                        Reply
                      </Text>
                    </View>
                  </View>
                );
              }}
              keyExtractor={(item, index) => {
                return item._id;
              }}
            />
          )
        )}
      </>
    );
  }
);

export default Comment;
