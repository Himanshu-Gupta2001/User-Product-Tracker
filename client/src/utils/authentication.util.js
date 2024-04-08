import store from "../store.js";

const getAuthHeader = () => {
    return {
        token: localStorage.getItem('token')
    }
}

const makeSession = ({ token, user }) => {
    localStorage.setItem('token', token)
    store.user = user;
}

const removeToken = () => {
    localStorage.removeItem('token')
}

const isUserLogin = () => {
    try {
        return !!localStorage.getItem('token');
    } catch (error) {
        console.error(error);
    }
}

export {
    getAuthHeader,
    makeSession,
    removeToken,
    isUserLogin,
}