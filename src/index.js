//require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"

dotenv.config({
    path: './.env'
});

console.log("MONGODB_URL:", process.env.MONGODB_URL);
app.on("error", (error) => {
    console.log("App error:", error);
    throw error;
});
connectDB()
.then(() => {
    app.listen(process.env.PORT || 800 , () => {
        console.log(`Server is running on PORT :  ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log(`MONGODB connection failed !!! `, error)
})

/*
import express from "express"
const app= express();
( async () => {
    try {
mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error) =>{
            console.log("App cant communicate to db" , error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })

} catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()
    */
   