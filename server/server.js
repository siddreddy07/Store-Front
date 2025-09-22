import express from 'express'
import { dbConnect } from './src/services/dbConnect.js'
import userRouter from './src/routes/user.routes.js'
import storeRouter from './src/routes/store.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

const PORT = 8080


app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


app.get('/',async(req,res)=>{
    return res.send("Hello World")
})


app.use('/api/auth',userRouter)
app.use('/api/store',storeRouter)

app.listen(PORT,async()=>{
    console.log("Running on PORT :",PORT)
    await dbConnect()
})