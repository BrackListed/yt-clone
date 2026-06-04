import "dotenv/config"
import express from "express"
import cors from "cors"
import { clerkMiddleware, getAuth } from '@clerk/express'
import { verifyWebhook } from "@clerk/express/webhooks"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { v2 as cloudinary } from "cloudinary"
import multer from "multer"
import fs from "fs"

const app = express()
app.use(cors({origin: ["http://localhost:5173"], credentials: true}))
app.use(clerkMiddleware())
app.use(express.json())

const pool = new Pool({connectionString: process.env.DATABASE_URL})
const db = drizzle(process.env.DATABASE_URL!)


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


app.get("/hello", async (req, res) => {
    res.json({message: "Hello"})
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })
app.post("/upload", upload.single('video'), async(req, res) => {
  try{
    const {userId} = getAuth(req)
    const result = await cloudinary.uploader.upload(req.file!.path, {resource_type: "video", upload_preset: "ml_default"}) as any
    const minutes = Math.floor(result.duration / 60)
    const seconds = Math.floor(result.duration % 60)
    const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`
    console.log(JSON.stringify(result)) 
    await pool.query("INSERT INTO uploads(user_id, video_url, title, duration) VALUES($1, $2, $3 $4)", [userId, result.secure_url, result.display_name, duration])
    fs.unlinkSync(req.file!.path)
  } catch(err){
    console.log(err)
    res.status(500).json({error: err})
  }

})

app.post('/clerk/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const evt = await verifyWebhook(req)
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)
    if(evt.type === "user.created"){
        const {id, email_addresses, first_name, created_at} = evt.data
        await pool.query("INSERT INTO users(clerk_user_id, email, username, created_at) VALUES($1, $2, $3, $4)", [id, email_addresses[0]?.email_address ?? "", first_name, new Date(created_at).toISOString()])
    }
    return res.send('Webhook received')
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return res.status(400).send('Error verifying webhook')
  }
})


app.listen(5000, () => console.log('Listening on http://localhost:5000'));