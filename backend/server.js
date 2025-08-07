import app from "./app.js";
import { connectToDb } from "./db/connectToDB.js";
import {startCronJobs} from "./src/cronJobs/deleteUsers.js";
import { connectRedis } from "./db/redis.js";


/**
 * Connecting to DataBase
 */
connectToDb()
    .then((conn) => {
        console.log(`DataBase connected successfully to ${conn.connection.host}`);

        /**
         * Running cron-jobs..
         */
        startCronJobs();
        /**
         * Starting the server.
         */
        app.listen(process.env.PORT,process.env.HOST,() => {
            console.log(`server is running on ${process.env.HOST}:${process.env.PORT}`);
        });

        /**
         * Connecting to Redis
         */
        connectRedis();
    })
    .catch((err) => {
        console.log(`Error connecting to DB app is not running ${err}`);
    })


    
   