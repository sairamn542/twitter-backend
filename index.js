import express from "express"
import dotenv from "dotenv"
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js"
import tweetRoute from "./routes/tweetRoute.js"
import cors from "cors"

dotenv.config({
    path : ".env"
})
databaseConnection();
const app = express();
//middleware
app.use(express.urlencoded({
    extended : true
}))
app.use(express.json())
app.use(cookieParser())

// const corsOption = {
//   origin: "http://localhost:3000",
//   credentials: true,
// };
const allowedOrigins = [
  "http://localhost:3000",
  "https://twitter-sairam.netlify.app"
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow requests like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "CORS Error: Origin not allowed";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // required if using cookies
};

app.use(cors(corsOptions))
//api
app.use("/api/v1/user", userRoute)
app.use("/api/v1/tweet", tweetRoute)

app.listen(process.env.PORT, ()=>{
    console.log(`Server Started in ${process.env.PORT}`)
})