import "dotenv/config"
import express from "express"
import cors from "cors"

const app = express()
app.use(cors({origin: ["http://localhost:5173"], credentials: true}))

app.use(express.json())

app.get("/hello", async (req, res) => {
    res.json({message: "Hello"})
})

// ADD THIS AT THE BOTTOM TO OPEN THE PORT
app.listen(5000, () => console.log('Listening on http://localhost:5000'));