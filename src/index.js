//require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path: './.env'
});

console.log("MONGODB_URL:", process.env.MONGODB_URL);
connectDB()


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
   