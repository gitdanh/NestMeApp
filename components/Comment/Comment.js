import { forwardRef, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Animated,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
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
import Octicons from "react-native-vector-icons/Octicons";

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
      rowRefs,
    },
    ref
  ) => {
    const navigator = useNavigation();
    const { privateRequest } = usePrivateHttpClient();
    const authUsername = useSelector((state) => state.authenticate.username);

    const [viewRepliesLoading, setViewRepliesLoading] = useState(false);
    const [deleteCmtLoading, setDeleteCmtLoading] = useState(false);

    const onPressCreatorHandler = () => {
      navigator.navigate(
        authUsername === comment.user.username ? "Profile" : "OtherProfile",
        {
          isOwnProfile: authUsername === comment.user.username ? true : false,
          username: comment.user.username,
        }
      );
    };

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

    const deleteThisPostComment = async (dComment, isReplyComment) => {
      if (!deleteCmtLoading) {
        try {
          setDeleteCmtLoading(true);
          const response = await deletePostComment(
            dComment._id,
            privateRequest
          );
          if (response.message) {
            if (isReplyComment) {
              deleteReplyComment(comment._id, dComment._id);
            } else {
              setComments((prevComments) =>
                prevComments.filter(
                  (prevComment) => prevComment._id !== dComment._id
                )
              );
            }

            setDeleteCmtLoading(false);
          }
        } catch (err) {
          setDeleteCmtLoading(false);
        }
      }
    };

    const handleDeletePostComment = (dComment, isReplyComment = false) => {
      Alert.alert("Are you sure?", "Action cannot be undone!", [
        { text: "Cancle" },
        {
          text: "Yes",
          onPress: () => deleteThisPostComment(dComment, isReplyComment),
          style: "destructive",
        },
      ]);
    };

    const rightSwipe = (
      progress,
      dragX,
      thisComment,
      isReplyComment = false
    ) => {
      let totalWidth = authUsername === thisComment.user.username ? 120 : 60;

      const trans = dragX.interpolate({
        inputRange: [-1 * totalWidth, 0],
        outputRange: [0, totalWidth],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "gray",
            },
            { transform: [{ translateX: trans }] },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              [...rowRefs.entries()].forEach(([key, ref]) => {
                ref.close();
              });
              replyClick();
            }}
            activeOpacity={0.4}
          >
            <View
              style={{
                width: 60,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Octicons name="reply" size={30} />
            </View>
          </TouchableOpacity>
          {/* <View
            style={{
              flex: 1,
              borderStyle: "solid",
              borderWidth: 0.5,
              borderColor: "white",
              width: 0,
              height: "80%",
            }}
          ></View> */}
          {authUsername === thisComment.user.username && (
            <TouchableOpacity
              onPress={() => {
                [...rowRefs.entries()].forEach(([key, ref]) => {
                  ref.close();
                });
                handleDeletePostComment(thisComment, isReplyComment);
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 60,
                  alignItems: "center",
                  backgroundColor: "red",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <Octicons name="trash" size={30} />
              </View>
            </TouchableOpacity>
          )}
        </Animated.View>
      );
    };

    return (
      <>
        <Swipeable
          key={comment._id}
          ref={(ref) => {
            if (ref && !rowRefs.get(comment._id)) {
              rowRefs.set(comment._id, ref);
            }
          }}
          renderRightActions={(progress, dragX) =>
            rightSwipe(progress, dragX, comment)
          }
          onSwipeableWillOpen={() => {
            [...rowRefs.entries()].forEach(([key, ref]) => {
              if (key !== comment._id && ref) ref.close();
            });
          }}
          overshootRight={false}
          overshootLeft={false}
        >
          <View style={{ flexDirection: "row", padding: 20 }}>
            <Avatar
              source={getAvatarSource(comment.user.profile_picture)}
              rounded
              size={45}
              onPress={onPressCreatorHandler}
            />
            <View
              style={{ flexDirection: "column", marginLeft: 20, marginTop: -4 }}
            >
              <Text
                style={{ color: "white", fontSize: 15, fontWeight: 700 }}
                onPress={onPressCreatorHandler}
              >
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
        </Swipeable>
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
                  <Swipeable
                    key={item._id}
                    ref={(ref) => {
                      if (ref && !rowRefs.get(item._id)) {
                        rowRefs.set(item._id, ref);
                      }
                    }}
                    renderRightActions={(progress, dragX) =>
                      rightSwipe(progress, dragX, item, true)
                    }
                    onSwipeableWillOpen={() => {
                      [...rowRefs.entries()].forEach(([key, ref]) => {
                        if (key !== item._id && ref) ref.close();
                      });
                    }}
                    overshootRight={false}
                    overshootLeft={false}
                  >
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
                        onPress={onPressCreatorHandler}
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
                          onPress={onPressCreatorHandler}
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
                          style={{
                            color: "gray",
                            fontSize: 13,
                            fontWeight: 400,
                          }}
                          onPress={replyClick}
                        >
                          Reply
                        </Text>
                      </View>
                    </View>
                  </Swipeable>
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
