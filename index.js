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
//     origin : "http://localhost:3000",
//     credentials : true
// }
// const corsOption = {
//     origin: "http://localhost:3000",
//     credentials: true, // This is crucial
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Accept"]
// }
const corsOption = {
  origin: [
    "http://localhost:4000",
    "https://twitter-sairam.netlify.app"
  ],
  credentials: true,
};
app.use(cors(corsOption))
app.use(cors(corsOption))
//api
app.use("/api/v1/user", userRoute)
app.use("/api/v1/tweet", tweetRoute)

app.listen(process.env.PORT, ()=>{
    console.log(`Server Started in ${process.env.PORT}`)
})