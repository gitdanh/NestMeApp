import * as httprequest from '../utils/httprequest';
export const getUserByUsername = async (username, sendRequest) => {
    try {
      const response = await sendRequest(`/users/${username}`);
      return response.data.user;
    } catch (err) {
      console.log("Lỗi lấy thông tin người khác:", err);
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

  export const searchUsers = async (data) => {
    try {
      const response = await httprequest.get(`/users/search?searchText=${data}`);
      return response;
    } catch (error) {
      console.log("Lỗi search users:", error);
      throw new Error("Đã xảy ra lỗi search users");
    }
  };