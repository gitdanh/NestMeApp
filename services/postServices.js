export const createPost = async (formData, sendRequest) => {
  try {
    const response = await sendRequest("/posts", "post", formData, {
      headers: { "Content-Type": "application/json" },
    });
    // if (response?.status !== 201) throw new Error(response?.data?.message);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getHomePosts = async (page = 1, limit = 10, sendRequest) => {
  try {
    const response = await sendRequest(`/posts?page=${page}?limit=${limit}`);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getUserPosts = async (
  username,
  page = 1,
  limit = 15,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/posts/user/${username}?page=${page}?limit=${limit}`
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getSavedPosts = async (
  username,
  page = 1,
  limit = 15,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/posts/user/${username}/saved-posts?page=${page}?limit=${limit}`
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getPost = async (postId, sendRequest) => {
  try {
    const response = await sendRequest(`/posts/${postId}`);

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const reactPost = async (data, sendRequest) => {
  try {
    const response = await sendRequest(
      `/posts/react/${data.postId}`,
      "patch",
      { emoji: data.emoji },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getPostComments = async (
  postId,
  page = 1,
  limit = 30,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/posts/${postId}/comments?page=${page}?limit=${limit}`
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getReplyComments = async (
  postId,
  commentId,
  page = 1,
  limit = 300,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/posts/${postId}/comments/${commentId}/replies?page=${page}?limit=${limit}`
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const comment = async (postId, commentText, sendRequest) => {
  try {
    const response = await sendRequest(
      `/posts/comments`,
      "post",
      { postId: postId, comment: commentText },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const replyComment = async (
  postId,
  commentId,
  commentText,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/posts/comments`,
      "post",
      { postId: postId, comment: commentText, reply_to: commentId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const reportPost = async (postId, reason, sendRequest) => {
  try {
    const response = await sendRequest(
      "/posts/report",
      "post",
      { postId: postId, reason: reason },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const savePost = async (postId, isSave, sendRequest) => {
  try {
    const response = await sendRequest(
      `/posts/${postId}`,
      "post",
      { save: isSave },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const deletePost = async (postId, sendRequest) => {
  try {
    const response = await sendRequest(`/posts/${postId}`, "delete", {
      headers: { "Content-Type": "application/json" },
    });

    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const deletePostComment = async (commentId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/posts/comment/${commentId}`,
      "delete",
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response?.data;
  } catch (err) {
    throw err;
  }
};
