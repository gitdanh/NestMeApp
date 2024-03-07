
export const getUserByUsername = async (username, sendRequest) => {
    try {
      const response = await sendRequest(`/users/${username}`);
      return response.data.user;
    } catch (err) {
      console.log("Lỗi lấy thông tin người khác:", err);
      throw err;
    }
  };