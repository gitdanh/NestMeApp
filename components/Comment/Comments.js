import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Avatar } from "react-native-elements";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import usePrivateHttpClient from "../../axios/private-http-hook";
import {
  comment,
  getPostComments,
  replyComment,
} from "../../services/postServices";
function Comments({ post }) {
  const { isLoading, privateRequest } = usePrivateHttpClient();

  const [text, setText] = useState("");
  const avatar = useSelector((state) => state.authenticate.avatar);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [commentsPage, setCommentsPage] = useState(1);
  const [isEndReached, setIsEndReached] = useState(false);

  const [initialText, setInitialText] = useState("");
  const [isReply, setIsReply] = useState(false);
  const [replyCommentId, setReplyCommentId] = useState("");
  const [replyComments, setReplyComments] = useState({});
  const [commentViewReplies, setCommentViewReplies] = useState({});

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [inputRef.current]);

  const handleEndReached = () => {
    if (!commentsLoading && hasMoreComments) {
      console.log("Last comment reached");
      setCommentsPage((prev) => prev + 1);
      setIsEndReached(true);
    }
  };

  const lastCommentRef = useCallback(
    (index) => {
      if (index === comments.length - 1 && !isEndReached) {
        return {
          onLayout: () => setIsEndReached(false),
          ref: lastCommentRef,
        };
      }
      return null;
    },
    [isEndReached, comments.length]
  );

  const loadComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const response = await getPostComments(
        post._id,
        commentsPage,
        30,
        privateRequest
      );
      if (response) {
        setHasMoreComments(response.comments > 0 && response.comments === 30);
        setComments((prevComments) => [...prevComments, ...response.comments]);
      }
      setCommentsLoading(false);
    } catch (err) {
      setCommentsLoading(false);
      console.error("Error loading comments: ", err);
    }
  }, [post._id, commentsPage]);

  useEffect(() => {
    loadComments();
  }, [post._id, commentsPage]);

  const handleChangeViewReplies = (commentId, newValue) => {
    setCommentViewReplies((prev) => ({
      ...prev,
      [commentId]: newValue,
    }));
  };

  // Function to add a replyComment to the state
  const addReplyComments = (commentId, replyComments) => {
    setReplyComments((prevComments) => ({
      ...prevComments,
      [commentId]: [...replyComments],
    }));
  };

  // Function to add a replyComment to the state
  const addReplyComment = (commentId, replyComment) => {
    setReplyComments((prevComments) => ({
      ...prevComments,
      [commentId]: [...(prevComments[commentId] || []), replyComment],
    }));
    setComments((prevComments) => {
      const updatedComments = [...prevComments];
      const commentIndex = updatedComments.findIndex(
        (comment) => comment._id === commentId
      );
      if (commentIndex !== -1) {
        const updatedComment = { ...updatedComments[commentIndex] };
        updatedComment.children_cmts_count =
          (updatedComment.children_cmts_count || 0) + 1;
        updatedComments[commentIndex] = updatedComment;
      }
      return updatedComments;
    });
    setCommentViewReplies((prev) => ({
      ...prev,
      [commentId]: true,
    }));
  };

  const deleteReplyComment = (commentId, replyCommentId) => {
    setReplyComments((prevComments) => {
      const updatedReplies = { ...prevComments };
      if (updatedReplies[commentId]) {
        updatedReplies[commentId] = updatedReplies[commentId].filter(
          (reply) => reply._id !== replyCommentId
        );
      }
      return updatedReplies;
    });

    setComments((prevComments) => {
      const updatedComments = [...prevComments];
      const commentIndex = updatedComments.findIndex(
        (comment) => comment._id === commentId
      );
      if (commentIndex !== -1) {
        const updatedComment = { ...updatedComments[commentIndex] };
        updatedComment.children_cmts_count =
          (updatedComment.children_cmts_count || 0) - 1;
        updatedComments[commentIndex] = updatedComment;
      }
      return updatedComments;
    });
  };

  const handleSendComment = async () => {
    if (!isLoading) {
      try {
        if (!isReply) {
          const response = await comment(post._id, text, privateRequest);
          if (response) {
            setComments((prevComments) => [response.comment, ...prevComments]);
            setReplyCommentId("");
            setText("");
            setInitialText("");
            // socket.current.emit("sendNotification", {
            //   sender_id: user?._id,
            //   receiver_id: [props.userId],
            //   content_id: props.postId,
            //   type: "comment",
            // });
            if (!isReply) setIsReply(false);
          }
        } else if (replyCommentId.trim() !== "") {
          const response = await replyComment(
            post._id,
            replyCommentId,
            text,
            privateRequest
          );
          if (response) {
            addReplyComment(response.comment.parent._id, response.comment);
            setReplyCommentId("");
            setText("");
            setInitialText("");
            // socket.current.emit("sendNotification", {
            //   sender_id: user?._id,
            //   receiver_id: [props.userId],
            //   content_id: props.postId,
            //   type: "reply",
            // });
            if (!isReply) setIsReply(false);
          }
        }
      } catch (err) {
        console.error("Error while post comment: ", err);
      }
    }
  };

  useEffect(() => {
    setText(initialText);
  }, [initialText, replyCommentId]);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="height"
        enabled={Platform.OS === "ios"}
        keyboardVerticalOffset={110}
      >
        {comments.length > 0 && (
          <FlatList
            data={comments}
            renderItem={(itemData) => {
              return (
                <Comment
                  inputRef={inputRef}
                  postId={post._id}
                  comment={itemData.item}
                  setComments={setComments}
                  setReplyCommentId={setReplyCommentId}
                  setIsReply={setIsReply}
                  setInitialText={setInitialText}
                  replyComments={replyComments[itemData.item._id] || []}
                  children_cmts_count={itemData.item.children_cmts_count}
                  addReplyComments={addReplyComments}
                  deleteReplyComment={deleteReplyComment}
                  viewReplies={commentViewReplies[itemData.item._id]}
                  setViewReplies={(value) =>
                    handleChangeViewReplies(itemData.item._id, value)
                  }
                  {...lastCommentRef(itemData.index)}
                />
              );
            }}
            keyExtractor={(item, index) => {
              return item._id;
            }}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
          />
        )}
        {commentsLoading && commentsPage > 1 && <ActivityIndicator />}

        <View
          style={{
            flex: 1,
            height: 70,
            width: "100%",
            position: "absolute",
            backgroundColor: "black",
            bottom: 0,
            elevation: 5,
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            paddingHorizontal: 15,
            justifyContent: "space-evenly",
            borderWidth: 0.5,
            borderTopColor: "#262626",
            alignSelf: "center",
          }}
        >
          <View>
            <Avatar
              source={avatar === "" ? defaultAvatar : { uri: avatar }}
              rounded
              size={40}
            />
          </View>
          <TextInput
            ref={inputRef}
            style={{
              width: "80%",
              color: "white",
              marginLeft: 10,
              height: "100%",
              paddingTop: 10,
            }}
            placeholder="Comment..."
            placeholderTextColor={"gray"}
            multiline={true}
            value={text}
            onChangeText={(val) => setText(val)}
          />

          <TouchableOpacity
            disabled={isLoading || text === ""}
            onPress={handleSendComment}
          >
            <Ionicons color="#fff" size={20} name="paper-plane-sharp" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default Comments;
