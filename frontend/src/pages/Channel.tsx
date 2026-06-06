
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Left } from "../assets/Left"
import { Header } from "../assets/Header"
import { useAuth } from "@clerk/clerk-react"
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

interface UserType {
    id: string
    clerk_user_id: string
    email: string
    username: string
    created_at: string
    image_url: string
}

export function Channel(){
    const [hideSide, setHideSide] = useState(true)
    const [globalVideos, setGlobalVideos] = useState<VideosType[]>([])
    const {username} = useParams()
    const [globalUsers, setGlobalUsers] = useState<UserType[]>()
    const user = globalUsers?.find((user) => user.username === username)
    const userId = user?.id
    const videos = globalVideos.filter((videos) => videos.user_id === userId )
    const {getToken} = useAuth()
    useEffect(() => {
        const fetchVideoData = async() => {
            const token = getToken()
            const result = await axios.get("http://localhost:5000/global/upload", {headers: {Authorization: `Bearer ${token}`}})
            setGlobalVideos(result.data)
        }
        const fetchUserData = async() => {
            const token = getToken()
            const result = await axios.get("http://localhost:5000/users", {headers: {Authorization: `Bearer ${token}`}})
            setGlobalUsers(result.data)
        }
        fetchVideoData()
        fetchUserData()
    }, [])
    return(
        <div className="flex">
            <Left
            hideSide = {hideSide}
            setHideSide = {setHideSide}
            />
            <div className="flex flex-col w-screen h-screen">
                <Header
                hideSide = {hideSide}
                setHideSide={setHideSide}
                />
                <div className={`flex-1 flex flex-col ml-20 p-10 h-screen ${hideSide ? "": "pl-[16.67%]"}`}>
                    <img src="/bannerexample.png" className="h-60 w-10/12 rounded-lg object-cover object-center bg-zinc-800" alt="Channel Banner"></img>
                    <div className="mt-10 w-full gap-5 flex ">
                        <img className="rounded-full w-40 h-40" src = {user?.image_url}></img>
                        <div className="flex flex-col gap-3">
                            <span className="text-4xl text-zinc-50 font-bold">{user?.username}</span>
                            <div className="flex gap-1">
                                <span className="text-zinc-50 font-semibold">@{user?.username}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-400">0 Subscribers</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-400">{videos.length} videos</span>
                            </div>
                            <div className="text-gray-400 w-fit h-fit">Description!</div>
                        </div>
                    </div>
                    <div className="w-full border-b border-white/10">
                        <span className="mt-10 text-zinc-50 flex flex-col pb-3 w-fit border-b-3 border-b-zinc-50">Videos</span>
                    </div>
                    Hey
                </div>
            </div>
        </div>
    )
}