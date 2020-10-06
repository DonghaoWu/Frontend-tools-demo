export const setErrorMessage = (msg) => {
    return msg.slice(5).split('-').join(' ');
}