export const generateRandomId = () => {
    const min = 200;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}