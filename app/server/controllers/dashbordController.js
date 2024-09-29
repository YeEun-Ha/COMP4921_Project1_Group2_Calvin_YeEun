import {
    updateUrlContentStatus,
    getUrlContent,
    getUrlContents,
} from '../models/urlModel';

export const getContentList = async () => {
    try {
        const data = await getUrlContents();
        return data;
    } catch (err) {
        console.error('Error getting content');
        return false;
    }
};

export const getContentItem = async (payload) => {
    try {
        const { urlID } = payload;
        const data = await getUrlContent(urlID);
        return data;
    } catch (err) {
        console.error('Error getting content');

        return null;
    }
};

export const updateContentStatus = async (payload) => {
    try {
        const { urlId, userId, active } = payload;

        const data = await updateUrlContentStatus(urlId, userId, active);
        return data;
    } catch (err) {
        console.log('Error updating url status');
        return null;
    }
};
