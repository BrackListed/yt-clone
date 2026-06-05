import { useParams } from "react-router-dom"
import { Left } from "../assets/Left"
import { Header } from "../assets/Header"
import { useAuth } from "@clerk/clerk-react"
import { useEffect, useState } from "react"
import axios from "axios"

interface VideosType{
    id: string
    user_id: string
    video_url: string
    title: string
    duration: string
    thumbnail: string
    created_at: string
    likes: number
}

export function Watch(){
    const {id} = useParams()
    const [hideSide, setHideSide] = useState(true)
    const {getToken} = useAuth()
    const [videos, setVideos] = useState<VideosType[]>([])
    const selectedVideo = videos.find((v) => v.id === id)
    useEffect(() => {
        const fetchExpressData = async() => {
            const token = getToken()
            const result = await axios.get("http://localhost:5000/global/upload", {headers: {Authorization: `Bearer ${token}`}})
            setVideos(result.data)
        }
        fetchExpressData()
    }, [])
    return(
        <div className="flex">
            {hideSide === false &&<div className="fixed left-[16.67%] inset-y-0 right-0 bg-black/50 z-40"></div>}
            <Left
            hideSide = {hideSide}
            setHideSide = {setHideSide}
            />
            <div className="flex flex-col w-screen h-screen">
                <div className="mt-8">
                    <Header
                    hideSide = {hideSide}
                    setHideSide={setHideSide}
                    />
                </div>
                <div className="mx-3 flex gap-5">
                    <div className="flex flex-col gap-3 w-full h-full">
                        <video src = {selectedVideo?.video_url} className="bg-black rounded-2xl w-8/12 h-120" controls autoPlay></video>
                    </div>
                </div>
            </div>
        </div>
    )
}