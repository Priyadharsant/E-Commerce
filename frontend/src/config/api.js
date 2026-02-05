const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

const apiUrl = (path = "") => {
    if (!path) return API_BASE;
    return `${"http://localhost:5000"}${path.startsWith("/") ? path : `/${path}`}`;
};

const ENDPOINTS = {
    LOGIN: "/login",
    SIGNUP: "/signup",
    LOGOUT: "/logout",
    CATEGORIES: "/categories",
    IS_AUTH: "/isAuth",
    ADD_CART: "/add_cart",
    DELETE_CART: "/delete_cart",
    GET_CART: "/get_cart",
    GET_PRODUCTS: "/get",
    FILTER: "/filter",
};

export { API_BASE, apiUrl, ENDPOINTS };
