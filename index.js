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
// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://twitter-sairam.netlify.app"
// ];

const allowedOrigins = [
    "https://twitter-sairam.netlify.app", // Your Netlify frontend
    "http://localhost:3000" // for local development
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        
        // Check if the origin is in the allowed list
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // For other origins, you can choose to allow or block
            // For deployment, you might want to allow all:
            callback(null, true);
            
            // Or to be more restrictive:
            // callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
// app.use(cors())
//api
app.use("/api/v1/user", userRoute)
app.use("/api/v1/tweet", tweetRoute)

app.listen(process.env.PORT, ()=>{
    console.log(`Server Started in ${process.env.PORT}`)
})