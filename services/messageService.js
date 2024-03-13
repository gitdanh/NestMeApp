import * as httprequest from '../utils/httprequest';

export const getMessages = async (conversationId, skip, userId) => {
    try {
        const response = await httprequest.get(`/messages/${conversationId}?skip=${skip}&userId=${userId}`);
        return response;
    } catch (error) {
        console.log('Lỗi lấy thong tin message:', error);
        throw new Error('Đã xảy ra lỗi lấy thong tin message');
    }
};

export const sendMessage = async (data) => {
    try {
        const response = await httprequest.post(`/messages/send`, data);
        return response;
    } catch (error) {
        console.log('Lỗi send message:', error);
        throw new Error('Đã xảy ra lỗi send message');
    }
};

export const addReader = async (data) => {
    try {
        const response = await httprequest.put(`/messages/addReader`, data);
        return response;
    } catch (error) {
        console.log('Lỗi add reader:', error);
        throw new Error('Đã xảy ra lỗi add reader');
    }
};

export const deleteMsg = async (data) => {
    try {
        const response = await httprequest.put(`/messages/delete`, data);
        return response;
    } catch (error) {
        console.log('Lỗi unsent message:', error);
        throw new Error('Đã xảy ra lỗi add reader');
    }
};