import * as httprequest from '../utils/httprequest';

export const getNotifications = async (userId, skip) => {
    try {
        const response = await httprequest.get(`/notifications/${userId}?skip=${skip}`);
        return response;
    } catch (error) {
        console.log('Lỗi lấy thong tin notification:', error);
        throw new Error('Đã xảy ra lỗi lấy thong tin notification');
    }
};

export const addReader = async () => {
    try {
        const response = await httprequest.put(`/notifications/addReader`);
        return response;
    } catch (error) {
        console.log('Lỗi add reader:', error);
        throw new Error('Đã xảy ra lỗi add reader');
    }
};