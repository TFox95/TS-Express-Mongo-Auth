const getServerTime = (): string => {
    const dateString = new Date().toISOString();
    return dateString;
};

const serverInfo = (namespace: string, message: string, obj?: any) => {
    if (obj) {
        console.log(`[${getServerTime()}] [${namespace}] [INFO] ${message}`, obj);
    } else {
        console.log(`[${getServerTime()}] [${namespace}] [INFO] ${message}`);
    }
};

const serverWarn = (namespace: string, message: string, obj?: any) => {
    if (obj) {
        console.warn(`[${getServerTime()}] [${namespace}] [WARNING] ${message}`, obj);
    } else {
        console.warn(`[${getServerTime()}] [${namespace}] [WARNING] ${message}`);
    }
};

const serverError = (namespace: string, message: string, obj?: any) => {
    if (obj) {
        console.error(`[${getServerTime()}] [${namespace}] [ERROR] ${message}`, obj);
    } else {
        console.error(`[${getServerTime()}] [${namespace}] [ERROR] ${message}`);
    }
};

const serverDebug = (namespace: string, message: string, obj?: any) => {
    if (obj) {
        console.debug(`[${getServerTime()}] [${namespace}] [DEBUG] ${message}`, obj);
    } else {
        console.debug(`[${getServerTime()}] [${namespace}] [DEBUG] ${message}`);
    }
};

export default { getServerTime, serverInfo, serverWarn, serverError, serverDebug };
