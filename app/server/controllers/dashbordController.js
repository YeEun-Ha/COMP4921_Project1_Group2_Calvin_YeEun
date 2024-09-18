export const getContent = async () => {
    try {
        const data = await getContent();

        return data;
    } catch (err) {
        console.error('Error getting content');
        return false;
    }
};
