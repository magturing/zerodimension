import {createClient} from "redis";

let redis;

const connectRedis = async () => {
    redis = createClient();

    redis.on("error",(err) => {
        console.log("Redis client error",err);
    });

    await redis.connect();
    console.log("Redis connect successfully ");

    return redis;
}

const getRedisClient = () => {
    if(!redis){
        throw new Error("Redis client not connected, call connectRedis() first. ");
    }
    return redis;
}

export {connectRedis,getRedisClient};