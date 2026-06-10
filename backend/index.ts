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
    const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
    const result = await cloudinary.uploader.upload(req.file!.path, {resource_type: "video", upload_preset: "ml_default"}) as any
    const minutes = Math.floor(result.duration / 60)
    const seconds = Math.floor(result.duration % 60)
    const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`
    const thumbnail = result.secure_url.replace('/video/upload', '/video/upload/so_0/').replace('.mp4', '.jpg') 
    await pool.query("INSERT INTO uploads(user_id, video_url, title, duration, thumbnail) VALUES($1, $2, $3, $4, $5)", [id.rows[0].id, result.secure_url, result.display_name, duration, thumbnail])
    fs.unlinkSync(req.file!.path)
  } catch(err){
    console.log(err)
    res.status(500).json({error: err})
  }
})

app.get('/global/upload', async(req, res) => {
  const result = await pool.query("SELECT * FROM uploads")
  res.json(result.rows)
})

app.get("/upload", async(req, res) => {
  const {userId} = getAuth(req)
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  const result = await pool.query("SELECT * FROM uploads WHERE user_id = $1", [id.rows[0].id])
  res.json(result.rows)
})

app.get("/upload/channel/:username", async(req, res) => {
  const id = await pool.query("SELECT id FROM users WHERE username = $1", [req.params.username])
  const result = await pool.query("SELECT * FROM uploads WHERE user_id = $1", [id.rows[0].id])
  res.json(result.rows)
})

app.get("/users", async(req, res) => {
  const result = await pool.query("SELECT * FROM users")
  res.json(result.rows)
})

app.post("/subscribe/:userId", async(req, res) => {
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [req.params.userId])
  const subscriptions = await pool.query("SELECT users.* FROM subscriptions JOIN users ON users.id = subscriptions.channel_id WHERE subscriptions.user_id = $1", [id.rows[0].id])
  const alreadySubscribed = subscriptions.rows.some((subscription) => (subscription.id === req.body.channelId))
  if(!alreadySubscribed){
    await pool.query("INSERT INTO subscriptions(user_id, channel_id) VALUES($1, $2)", [id.rows[0].id, req.body.channelId])
  }
})

app.get("/subscribe/status/:channelId", async(req, res) => {
  const {userId} = getAuth(req)
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  const subscriptions = await pool.query("SELECT users.*, subscriptions.channel_id FROM subscriptions JOIN users ON users.id = subscriptions.channel_id WHERE subscriptions.user_id = $1", [id.rows[0].id])
  const alreadySubscribed = subscriptions.rows.some((subscription) => (subscription.id === req.params.channelId))
  res.json(alreadySubscribed)
})

app.get("/subscriptions/channel", async(req, res) => {
  const {userId} = getAuth(req)
  const id = await pool.query("SELECT id from USERS WHERE clerk_user_id = $1", [userId])
  const result = await pool.query("SELECT users.*, subscriptions.channel_id FROM subscriptions JOIN users ON users.id = subscriptions.user_id WHERE subscriptions.channel_id = $1", [id.rows[0].id])
  res.json(result.rows)
})

app.post("/unsubscribe/:userId", async(req, res) => {
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [req.params.userId])
  const result = await pool.query("DELETE FROM subscriptions WHERE user_id = $1 AND channel_id = $2", [id.rows[0].id, req.body.channelId])
  res.json(result.rows)
})

app.get("/subscriptions/user", async(req, res) => {
  try{
    const {userId} = getAuth(req)
    const id = await pool.query("SELECT id from USERS where clerk_user_id = $1", [userId])
    const result = await pool.query("SELECT users.* FROM subscriptions JOIN users ON users.id = subscriptions.channel_id WHERE subscriptions.user_id = $1", [id.rows[0].id])
    res.json(result.rows)
  } catch(err){
    res.status(500).json({error: err})
  }
})


app.post("/likes/:userId", async(req, res) => {
  //if the video, matches the video_id in the user_id row, then it already exists
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [req.params.userId])
  const likedVideos = await pool.query("SELECT uploads.*, liked_videos.video_id FROM liked_videos JOIN uploads ON uploads.id = liked_videos.video_id WHERE liked_videos.user_id = $1", [id.rows[0].id])
  //selected all videos that are currently liked by the user
  //if the video is already in liked videos, likes - 1
  const dislikedVideos = await pool.query("SELECT uploads.*, disliked_videos.video_id FROM disliked_videos JOIN uploads ON uploads.id = disliked_videos.video_id WHERE disliked_videos.user_id = $1", [id.rows[0].id])
  const videoStatus = likedVideos.rows.some((videos) => (videos.video_id === req.body.videoId)) //returns true if the current video is already liked by the user, else it returns false
  const dislikedStatus = dislikedVideos.rows.some((videos) => (videos.id === req.body.videoId))
  if(videoStatus && dislikedStatus === false){
    await pool.query("UPDATE uploads SET likes = likes - 1 WHERE id = $1", [req.body.videoId])
    await pool.query("DELETE FROM liked_videos WHERE user_id = $1 AND video_id = $2", [id.rows[0].id, req.body.videoId])
  } else if(videoStatus === false && dislikedStatus === false){
    await pool.query("UPDATE uploads SET likes = likes + 1 WHERE id = $1", [req.body.videoId])
    await pool.query("INSERT INTO liked_videos(user_id, video_id) VALUES($1, $2)", [id.rows[0].id, req.body.videoId])
  } else if(videoStatus === false && dislikedStatus === true){
    await pool.query("UPDATE uploads SET dislikes = dislikes - 1 WHERE id = $1", [req.body.videoId])
    await pool.query("DELETE FROM disliked_videos WHERE user_id = $1 AND video_id = $2", [id.rows[0].id, req.body.videoId])
    await pool.query("UPDATE uploads SET likes = likes + 1 WHERE id = $1", [req.body.videoId])
    await pool.query("INSERT INTO liked_videos(user_id, video_id) VALUES($1, $2)", [id.rows[0].id, req.body.videoId])
  }
})

app.get("/likes/status/:userId/:videoId", async(req, res) => {
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [req.params.userId])
  const likedVideos = await pool.query("SELECT uploads.*, liked_videos.video_id FROM liked_videos JOIN uploads ON uploads.id = liked_videos.video_id WHERE liked_videos.user_id = $1", [id.rows[0].id])
  const videoStatus = likedVideos.rows.some((videos) => (videos.video_id === req.params.videoId))
  res.json(videoStatus)
})

app.post("/dislikes/:userId", async(req, res) => {
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [req.params.userId])
  const dislikedVideos = await pool.query("SELECT uploads.*, disliked_videos.video_id FROM disliked_videos JOIN uploads ON uploads.id = disliked_videos.video_id WHERE disliked_videos.user_id = $1", [id.rows[0].id])
  const likedVideos = await pool.query("SELECT uploads.*, liked_videos.video_id FROM liked_videos JOIN uploads ON uploads.id = liked_videos.video_id WHERE liked_videos.user_id = $1", [id.rows[0].id])
  const likedStatus = likedVideos.rows.some((videos) => (videos.video_id === req.body.videoId))
  const videoStatus = dislikedVideos.rows.some((videos) => (videos.video_id === req.body.videoId))
  if(videoStatus && likedStatus === false){
    await pool.query("UPDATE uploads SET dislikes = dislikes - 1 WHERE id = $1", [req.body.videoId])
    await pool.query("DELETE FROM disliked_videos WHERE user_id = $1 AND video_id = $2", [id.rows[0].id, req.body.videoId])
  } else if(videoStatus === false && likedStatus === false){
    await pool.query("UPDATE uploads SET dislikes = dislikes + 1 WHERE id = $1", [req.body.videoId])
    await pool.query("INSERT INTO disliked_videos(user_id, video_id) VALUES($1, $2)", [id.rows[0].id, req.body.videoId])
  } else if(videoStatus === false && likedStatus === true){
    await pool.query("UPDATE uploads SET dislikes = dislikes + 1 WHERE id = $1", [req.body.videoId])
    await pool.query("UPDATE uploads SET likes = likes - 1 WHERE id = $1", [req.body.videoId])
    await pool.query("DELETE FROM liked_videos WHERE user_id = $1 AND video_id = $2", [id.rows[0].id, req.body.videoId])
    await pool.query("INSERT INTO disliked_videos(user_id, video_id) VALUES($1, $2)", [id.rows[0].id, req.body.videoId])
  }
})

app.get("/dislikes/status/:userId/:videoId", async(req, res) => {
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [req.params.userId])
  const dislikedVideos = await pool.query("SELECT uploads.*, disliked_videos.video_id FROM disliked_videos JOIN uploads ON uploads.id = disliked_videos.video_id WHERE disliked_videos.user_id = $1", [id.rows[0].id])
  const videoStatus = dislikedVideos.rows.some((videos) => (videos.video_id === req.params.videoId))
  res.json(videoStatus)
})

app.post("/comments/:userId/:videoId", async(req, res) => {
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [req.params.userId])
  await pool.query("INSERT INTO comments(user_id, video_id) VALUES($1, $2)", [id.rows[0].id, req.params.videoId])
})

app.get("/comments/:videoId", async(req, res) => {
  const result = await pool.query("SELECT comments.*, users.username, users.image_url FROM comments JOIN users ON users.id = comments.user_id WHERE comments.upload_id = $1", [req.params.videoId])
  res.json(result)
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
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err)
})