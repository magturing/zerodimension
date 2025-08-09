import app from "./app.js";
import { connectToDb } from "./db/connectToDB.js";
import { startCronJobs } from "./src/cronJobs/deleteUsers.js";
import { connectRedis } from "./db/redis.js";
import { startScanWorker } from "./queues/scanWorker.js"; // <-- New import

connectToDb()
  .then(async (conn) => {
    console.log(`DataBase connected successfully to ${conn.connection.host}`);

    // Connect to Redis before starting workers
    await connectRedis();

    // Start cron jobs
    startCronJobs();

    // Start background worker AFTER Redis is ready
    startScanWorker();

    // Start the server
    app.listen(process.env.PORT, process.env.HOST, () => {
      console.log(`server is running on ${process.env.HOST}:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting to DB app is not running ${err}`);
  });
