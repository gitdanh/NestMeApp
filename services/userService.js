import * as httprequest from "../utils/httprequest";
export const getUserByUsername = async (username, sendRequest) => {
  try {
    const response = await sendRequest(`/users/${username}`);
    return response.data.user;
  } catch (err) {
    console.log("Lỗi lấy thông tin người khác:", err);
    throw err;
  }
};

export const searchUsers = async (data) => {
  try {
    const response = await httprequest.get(`/users/search?searchText=${data}`);
    return response;
  } catch (error) {
    console.log("Lỗi search users:", error);
    throw new Error("Đã xảy ra lỗi search users");
  }
};

export const updateUserPassword = async (data, sendRequest) => {
  try {
    const response = await sendRequest(
      "/users/auth-user/change-pass",
      "patch",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const updateUserProfile = async (data, sendRequest) => {
  try {
    const response = await sendRequest("/users/auth-user", "patch", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const getUserFriendsListByUsername = async (
  username,
  page = 1,
  limit = 20,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/users/${username}/friends?page=${page}&limit=${limit}`
    );
    return response?.data;
  } catch (err) {
    console.error("Lỗi lấy list friend:", err);
    throw err;
  }
};

export const getFriendRequestsList = async (
  page = 1,
  limit = 20,
  sendRequest
) => {
  try {
    const response = await sendRequest(
      `/users/auth-user/friend-requests?page=${page}&limit=${limit}`
    );
    return response?.data;
  } catch (err) {
    console.error("Lỗi lấy list friend request:", err);
    throw err;
  }
};

export const sendAddFriend = async (userId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/users/friend-requests/send/${userId}`,
      "patch"
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const removeAddFriend = async (userId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/users/friend-requests/remove/${userId}`,
      "patch"
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const unFriend = async (userId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/users/auth-user/unfriend/${userId}`,
      "patch"
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const acceptAddFriend = async (userId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/users/friend-requests/accept/${userId}`,
      "patch"
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const rejectAddFriend = async (userId, sendRequest) => {
  try {
    const response = await sendRequest(
      `/users/friend-requests/reject/${userId}`,
      "patch"
    );
    return response?.data;
  } catch (err) {
    throw err;
  }
};
