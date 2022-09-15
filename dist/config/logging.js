"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getServerTime = () => {
    const dateString = new Date().toISOString();
    return dateString;
};
const serverInfo = (namespace, message, obj) => {
    if (obj) {
        console.log(`[${getServerTime()}] [${namespace}] [INFO] ${message}`, obj);
    }
    else {
        console.log(`[${getServerTime()}] [${namespace}] [INFO] ${message}`);
    }
};
const serverWarn = (namespace, message, obj) => {
    if (obj) {
        console.warn(`[${getServerTime()}] [${namespace}] [WARNING] ${message}`, obj);
    }
    else {
        console.warn(`[${getServerTime()}] [${namespace}] [WARNING] ${message}`);
    }
};
const serverError = (namespace, message, obj) => {
    if (obj) {
        console.error(`[${getServerTime()}] [${namespace}] [ERROR] ${message}`, obj);
    }
    else {
        console.error(`[${getServerTime()}] [${namespace}] [ERROR] ${message}`);
    }
};
const serverDebug = (namespace, message, obj) => {
    if (obj) {
        console.debug(`[${getServerTime()}] [${namespace}] [DEBUG] ${message}`, obj);
    }
    else {
        console.debug(`[${getServerTime()}] [${namespace}] [DEBUG] ${message}`);
    }
};
exports.default = { getServerTime, serverInfo, serverWarn, serverError, serverDebug };
