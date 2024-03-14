import * as httprequest from '../utils/httprequest';

export const getUserConversations = async (userId) => {
    try {
        const response = await httprequest.get(`/conversation/${userId}`);
        return response;
    } catch (error) {
        console.log('Lỗi lấy danh sách message:', error);
        throw new Error('Đã xảy ra lỗi lấy danh sách message');
    }
};

export const searchCons = async (uId,search) => {
    try {
      const response = await httprequest.get(`/conversation/search?userId=${uId}&searchText=${search}`);
      return response;
    } catch (error) {
      console.log("Lỗi search cons:", error);
      throw new Error("Đã xảy ra lỗi search cons");
    }
  };

  export const checkCon = async (uId,searchuId) => {
    try {
      const response = await httprequest.get(`/conversation/check?userId=${uId}&userSearchId=${searchuId}`);
      return response;
    } catch (error) {
      console.log("Lỗi search cons:", error);
      throw new Error("Đã xảy ra lỗi search cons");
    }
  };

export const createConversation = async (data) => {
  try {
    const response = await httprequest.post(`/conversation/create`, data);
    return response;
  } catch (error) {
    console.log("Lỗi create con:", error);
    throw new Error("Đã xảy ra lỗi create con");
  }
};

export const deleteConversation = async (data) => {
  try {
      const response = await httprequest.put(`/conversation/delete`, data);
      return response;
  } catch (error) {
      console.log('Lỗi delete conversation:', error);
      throw new Error('Đã xảy ra lỗi xóa conversation');
  }
};

export const returnConversation = async (data) => {
  try {
      const response = await httprequest.put(`/conversation/return`, data);
      return response;
  } catch (error) {
      console.log('Lỗi return conversation:', error);
      throw new Error('Đã xảy ra lỗi return conversation');
  }
};
