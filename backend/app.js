import express from "express";
import dotenv from "dotenv";
import {errorMiddleware} from "./src/middlewares/errors/error.middleware.js";
import cookieParser from "cookie-parser";
import { globalRateLimiter } from "./src/utils/rateLimiter.js";
import cors from "cors";

/**
 * implementing dotenv in out application.
 */
dotenv.config({path:".env"});


/**
 * Using express globally to access using app variable.
 */
const app = express();


app.get("/",(req,res,next) => {
    res.send("Login to access this resource");
});


/**
 * using middlewares
 */
app.use(express.json());
app.use(cookieParser());
// app.use(globalRateLimiter);
app.use(cors({
    origin: ["http://127.0.0.1:5721", "http://localhost:5721",
     "http://192.168.56.1:5721",
      "http://192.168.59.1:5721",
      "http://192.168.56.2:5721",
      "http://192.168.1.4:5721",
      "http://16.170.121.109:5722",
	"http://16.170.121.109:5721",
	"http://16.170.121.109:5723"
    ],
    credentials: true,              
  }));

/**
 * Using Routes
 */
import routes from "./src/routes/index.js";
app.use("/api/v1",routes);


export default app;

app.use(errorMiddleware);
