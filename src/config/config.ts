import dotenv from "dotenv";

dotenv.config();

/** MongoDB config */
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false
};

const MONGO_USERNAME:string = `${process.env.MONGO_USERNAME}`;
const MONGO_PASSWORD:string = `${process.env.MONGO_PASSWORD}`;
const MONGO_HOST:string = `${process.env.MONGO_HOST}`;

const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`,
    options: MONGO_OPTIONS
};

/** Server Config */
const SERVER_HOSTNAME:string = `${process.env.SERVER_HOSTNAME}`;
const SERVER_PORT:string = `${process.env.SERVER_PORT}` ;

const SERVER_TOKEN_EXPIRE_TIME:string = `${process.env.SERVER_TOKEN_EXPIRE_TIME}`;
const SERVER_TOKEN_ISSUER:string = `${process.env.SERVER_TOKEN_ISSUER}`;
const SERVER_TOKEN_SECRET:string = `${process.env.SERVER_TOKEN_SECRET}`;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRE_TIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};

const config = {
    database: MONGO,
    server: SERVER
};

export default config;
